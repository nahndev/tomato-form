import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { parseExpression } from "cron-parser";
import { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ActionRunnerRegistry } from "../action/action-runner-registry.service";
import { ActionRunContext } from "../action/action-runner.interface";
import {
  CronJob,
  CronJobDocument,
  JobStatus,
} from "../schemas/cron-job.schema";
import {
  JobExecution,
  JobExecutionDocument,
  JobExecutionStatus,
} from "../schemas/job-execution.schema";

@Injectable()
export class JobRunner {
  private readonly logger = new Logger(JobRunner.name);

  constructor(
    @InjectModel(CronJob.name)
    private readonly cronJobModel: Model<CronJobDocument>,
    @InjectModel(JobExecution.name)
    private readonly jobExecutionModel: Model<JobExecutionDocument>,
    private readonly actionRunner: ActionRunnerRegistry,
  ) {}

  async run(cronJob: CronJob): Promise<JobExecution> {
    const execution = await new this.jobExecutionModel({
      id: uuidv4(),
      jobId: cronJob.id,
      status: JobExecutionStatus.RUNNING,
      startedAt: new Date(),
    }).save();

    await this.cronJobModel
      .findOneAndUpdate(
        { id: cronJob.id },
        { $set: { status: JobStatus.RUNNING } },
      )
      .exec();

    try {
      const results = await this.dispatch(cronJob);
      await this.complete(execution.id, cronJob, JobStatus.SUCCESS, results);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.error(`Job ${cronJob.id} failed: ${message}`);
      await this.complete(
        execution.id,
        cronJob,
        JobStatus.FAILED,
        null,
        message,
      );
    }

    const refreshed = await this.jobExecutionModel
      .findOne({ id: execution.id })
      .exec();
    return refreshed!;
  }

  private async dispatch(cronJob: CronJob): Promise<Record<string, unknown>[]> {
    const context: ActionRunContext = { results: [] };
    for (const action of cronJob.actions) {
      const runner = this.actionRunner.getRunner(action.type);
      const result = await runner.run(action, context);
      context.results.push(result);
    }
    return context.results;
  }

  private async complete(
    executionId: string,
    cronJob: CronJob,
    status: JobStatus,
    results: Record<string, unknown>[] | null,
    error?: string,
  ): Promise<void> {
    const finishedAt = new Date();

    await this.jobExecutionModel
      .findOneAndUpdate(
        { id: executionId },
        {
          $set: {
            status:
              status === JobStatus.SUCCESS
                ? JobExecutionStatus.SUCCESS
                : JobExecutionStatus.FAILED,
            finishedAt,
            result: results ? { actions: results } : null,
            error: error ?? null,
          },
        },
      )
      .exec();

    await this.cronJobModel
      .findOneAndUpdate(
        { id: cronJob.id },
        {
          $set: {
            status,
            lastRunAt: finishedAt,
            lastError: error ?? null,
            nextRunAt: this.computeNextRunAt(cronJob.cronExpression),
          },
        },
      )
      .exec();
  }

  private computeNextRunAt(cronExpression: string): Date | null {
    try {
      return parseExpression(cronExpression).next().toDate();
    } catch {
      return null;
    }
  }
}
