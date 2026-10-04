import { Module } from "@nestjs/common";
import { UserModule } from "@/user/user.module";
import { SubmissionDisplayService } from "./submission-display.service";

@Module({
  imports: [UserModule],
  providers: [SubmissionDisplayService],
  exports: [SubmissionDisplayService],
})
export class DisplayModule {}
