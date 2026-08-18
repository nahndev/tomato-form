import { Module } from "@nestjs/common";
import { MailModule } from "@/mail/mail.module";
import { UserModule } from "@/user/user.module";
import { SubmissionService } from "./submission.service";
import { SubmissionController } from "./submission.controller";

@Module({
  imports: [MailModule, UserModule],
  controllers: [SubmissionController],
  providers: [SubmissionService],
  exports: [SubmissionService],
})
export class SubmissionModule {}
