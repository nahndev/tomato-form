import { RabbitmqModule } from "@/rabbitmq/rabbitmq.module";
import { Module } from "@nestjs/common";
import { TemplateFileController } from "@/template-file/template-file.controller";
import { TemplateFileService } from "@/template-file/template-file.service";

@Module({
  imports: [RabbitmqModule],
  controllers: [TemplateFileController],
  providers: [TemplateFileService],
})
export class TemplateFileModule {}
