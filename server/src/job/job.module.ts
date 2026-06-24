import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EmitterModule } from "../emitter/emitter.module";
import { SubmissionModule } from "../submission/submission.module";
import { UserModule } from "../user/user.module";
import { MailModule } from "../mail/mail.module";
import { ActionRunnerRegistry } from "./action/action-runner-registry.service";
import { SubmissionCreationActionRunner } from "./action/submission-creation/submission-creation-action.runner";
import { SendMailActionRunner } from "./action/send-mail/send-mail-action.runner";
import { JobController } from "./job.controller";
import { JobHandler } from "./job.handler";
import { JobService } from "./job.service";
import { Job, JobSchema } from "./schemas/job.schema";
import {
  JobExecution,
  JobExecutionSchema,
} from "./schemas/job-execution.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Job.name, schema: JobSchema },
      { name: JobExecution.name, schema: JobExecutionSchema },
    ]),
    SubmissionModule,
    UserModule,
    MailModule,
    EmitterModule,
  ],
  controllers: [JobController],
  providers: [
    JobService,
    JobHandler,
    ActionRunnerRegistry,
    SubmissionCreationActionRunner,
    SendMailActionRunner,
  ],
  exports: [JobService],
})
export class JobModule {}
