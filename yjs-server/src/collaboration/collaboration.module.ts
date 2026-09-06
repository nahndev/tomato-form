import { CollaborationService } from "@/collaboration/collaboration.service";
import { SubmissionStrategy } from "@/collaboration/submission.strategy";
import { TemplateStrategy } from "@/collaboration/template.strategy";
import { RabbitmqModule } from "@/rabbitmq/rabbitmq.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [RabbitmqModule],
  providers: [CollaborationService, TemplateStrategy, SubmissionStrategy],
})
export class CollaborationModule {}
