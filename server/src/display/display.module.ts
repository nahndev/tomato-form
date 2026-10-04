import { Module } from "@nestjs/common";
import { UserModule } from "@/user/user.module";
import { WidgetValueModule } from "@/widget-value";
import { SubmissionDisplayService } from "./submission-display.service";

@Module({
  imports: [UserModule, WidgetValueModule],
  providers: [SubmissionDisplayService],
  exports: [SubmissionDisplayService],
})
export class DisplayModule {}
