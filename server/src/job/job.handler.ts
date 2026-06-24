import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { JobTriggeredEvent } from "../shared/events/job-triggered.event";
import { ActionRunnerRegistry } from "./action/action-runner-registry.service";
import { ActionRunContext } from "./action/action-runner.interface";
import { Job, JobDocument } from "./schemas/job.schema";
import {
  JobExecution,
  JobExecutionDocument,
  JobExecutionStatus,
} from "./schemas/job-execution.schema";

@Injectable()
export class JobHandler {
  private readonly logger = new Logger(JobHandler.name);

  constructor(
    @InjectModel(Job.name)
    private readonly jobModel: Model<JobDocument>,
    @InjectModel(JobExecution.name)
    private readonly jobExecutionModel: Model<JobExecutionDocument>,
    private readonly actionRunner: ActionRunnerRegistry,
  ) {}

  @OnEvent(JobTriggeredEvent.name)
  async handle(event: JobTriggeredEvent): Promise<void> {
    const job = await this.jobModel.findOne({ id: event.jobId }).exec();
    if (!job) return;
    await this.run(job);
  }

  private async run(job: Job): Promise<JobExecution> {
    const execution = await new this.jobExecutionModel({
      id: uuidv4(),
      jobId: job.id,
      status: JobExecutionStatus.RUNNING,
      startedAt: new Date(),
    }).save();

    try {
      const results = await this.dispatch(job);
      await this.complete(execution.id, JobExecutionStatus.SUCCESS, results);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.error(`Job ${job.id} failed: ${message}`);
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

  private async dispatch(job: Job): Promise<Record<string, unknown>[]> {
    const context: ActionRunContext = { results: [] };
    for (const action of job.actions) {
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
