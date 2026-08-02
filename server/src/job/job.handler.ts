import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { JobExecutionStatus, Prisma } from "@/database/prisma-client";
import { PrismaService } from "../database/prisma.service";
import { JobTriggeredEvent } from "../shared/events/job-triggered.event";
import { ActionRunnerRegistry } from "./action/action-runner-registry.service";
import { ActionRunContext } from "./action/action-runner.interface";
import { JobService, JobWithActions } from "./job.service";

@Injectable()
export class JobHandler {
  private readonly logger = new Logger(JobHandler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jobService: JobService,
    private readonly actionRunner: ActionRunnerRegistry,
  ) {}

  @OnEvent(JobTriggeredEvent.name)
  async handle(event: JobTriggeredEvent): Promise<void> {
    let job: JobWithActions;
    try {
      job = await this.jobService.findOne(event.jobId);
    } catch {
      return;
    }
    await this.run(job);
  }

  private async run(job: JobWithActions) {
    const execution = await this.prisma.jobExecution.create({
      data: {
        jobId: job.id,
        status: JobExecutionStatus.running,
        startedAt: new Date(),
      },
    });

    try {
      const results = await this.dispatch(job);
      await this.complete(execution.id, JobExecutionStatus.success, results);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.error(`Job ${job.id} failed: ${message}`);
      await this.complete(
        execution.id,
        JobExecutionStatus.failed,
        null,
        message,
      );
    }

    return this.prisma.jobExecution.findUnique({ where: { id: execution.id } });
  }

  private async dispatch(
    job: JobWithActions,
  ): Promise<Record<string, unknown>[]> {
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
    await this.prisma.jobExecution.update({
      where: { id: executionId },
      data: {
        status,
        finishedAt: new Date(),
        result: results
          ? ({ actions: results } as unknown as Prisma.InputJsonValue)
          : Prisma.DbNull,
        error: error ?? null,
      },
    });
  }
}
