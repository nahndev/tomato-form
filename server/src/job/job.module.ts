import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SubmissionModule } from "../submission/submission.module";
import { ActionRunnerRegistry } from "./action/action-runner-registry.service";
import { SubmissionCreationActionRunner } from "./action/runners/submission-creation-action-runner.service";
import { JobController } from "./job.controller";
import { JobService } from "./job.service";
import { JobRunner } from "./job/job-runner.service";
import { JobScheduler } from "./job/job-scheduler.service";
import { CronJob, CronJobSchema } from "./schemas/cron-job.schema";
import {
  JobExecution,
  JobExecutionSchema,
} from "./schemas/job-execution.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CronJob.name, schema: CronJobSchema },
      { name: JobExecution.name, schema: JobExecutionSchema },
    ]),
    SubmissionModule,
  ],
  controllers: [JobController],
  providers: [
    JobService,
    JobRunner,
    JobScheduler,
    ActionRunnerRegistry,
    SubmissionCreationActionRunner,
  ],
  exports: [JobService],
})
export class JobModule {}
