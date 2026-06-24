import { OnModuleInit } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { CronEventRegistry } from "../../emitter/cron-event.registry";
import { JobTriggeredEvent } from "../../shared/events/job-triggered.event";
import { JobService } from "../job.service";

@EventsHandler(JobTriggeredEvent)
export class JobTriggeredListener
  implements IEventHandler<JobTriggeredEvent>, OnModuleInit
{
  constructor(
    private readonly jobService: JobService,
    private readonly cronEventRegistry: CronEventRegistry,
  ) {}

  onModuleInit(): void {
    this.cronEventRegistry.bind(
      JobTriggeredEvent.name,
      (payload) => new JobTriggeredEvent((payload as { jobId: string }).jobId),
    );
  }

  async handle(event: JobTriggeredEvent): Promise<void> {
    await this.jobService.execute(event.jobId);
  }
}
