import { Module } from "@nestjs/common";
import { SubmissionDisplayService } from "./submission-display.service";

@Module({
  providers: [SubmissionDisplayService],
  exports: [SubmissionDisplayService],
})
export class DisplayModule {}
