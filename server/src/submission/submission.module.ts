import { Module } from "@nestjs/common";
import { MailModule } from "@/mail/mail.module";
import { SearchModule } from "@/search/search.module";
import { UserModule } from "@/user/user.module";
import { SubmissionService } from "./submission.service";
import { SubmissionController } from "./submission.controller";
import { SubmissionValueEventsController } from "./submission-value-events.controller";

@Module({
  imports: [MailModule, UserModule, SearchModule],
  controllers: [SubmissionController, SubmissionValueEventsController],
  providers: [SubmissionService],
  exports: [SubmissionService],
})
export class SubmissionModule {}
