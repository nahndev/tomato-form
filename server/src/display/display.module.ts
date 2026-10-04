import { Module } from "@nestjs/common";
import { UserModule } from "@/user/user.module";
import { WidgetValueModule } from "@/widget-value";
import { MappingContextLoader } from "./mapping-context.loader";
import { SubmissionDisplayService } from "./submission-display.service";

@Module({
  imports: [UserModule, WidgetValueModule],
  providers: [MappingContextLoader, SubmissionDisplayService],
  exports: [SubmissionDisplayService],
})
export class DisplayModule {}
