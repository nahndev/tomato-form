import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SubmissionModule } from "../submission/submission.module";
import { UserModule } from "../user/user.module";
import { MailModule } from "../mail/mail.module";
import { ActionRunnerRegistry } from "./action/action-runner-registry.service";
import { SubmissionCreationActionRunner } from "./action/submission-creation/submission-creation-action.runner";
import { SendMailActionRunner } from "./action/send-mail/send-mail-action.runner";
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
    UserModule,
    MailModule,
  ],
  controllers: [JobController],
  providers: [
    JobService,
    JobRunner,
    JobScheduler,
    ActionRunnerRegistry,
    SubmissionCreationActionRunner,
    SendMailActionRunner,
  ],
  exports: [JobService],
})
export class JobModule {}
