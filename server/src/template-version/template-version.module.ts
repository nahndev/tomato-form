import { RabbitmqModule } from "@/rabbitmq/rabbitmq.module";
import { Module } from "@nestjs/common";
import { TemplateFileClient } from "./template-file.client";
import { TemplateVersionController } from "./template-version.controller";
import { TemplateVersionService } from "./template-version.service";

@Module({
  imports: [RabbitmqModule],
  controllers: [TemplateVersionController],
  providers: [TemplateVersionService, TemplateFileClient],
  exports: [TemplateVersionService],
})
export class TemplateVersionModule {}
