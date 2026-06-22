import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ActionRunnerRegistry } from "../action/action-runner-registry.service";
import { ActionRunContext } from "../action/action-runner.interface";
import { CronJob } from "../schemas/cron-job.schema";
import {
  JobExecution,
  JobExecutionDocument,
  JobExecutionStatus,
} from "../schemas/job-execution.schema";

@Injectable()
export class JobRunner {
  private readonly logger = new Logger(JobRunner.name);

  constructor(
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

    try {
      const results = await this.dispatch(cronJob);
      await this.complete(execution.id, JobExecutionStatus.SUCCESS, results);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.error(`Job ${cronJob.id} failed: ${message}`);
      await this.complete(
        execution.id,
        JobExecutionStatus.FAILED,
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
    status: JobExecutionStatus,
    results: Record<string, unknown>[] | null,
    error?: string,
  ): Promise<void> {
    await this.jobExecutionModel
      .findOneAndUpdate(
        { id: executionId },
        {
          $set: {
            status,
            finishedAt: new Date(),
            result: results ? { actions: results } : null,
            error: error ?? null,
          },
        },
      )
      .exec();
  }
}
