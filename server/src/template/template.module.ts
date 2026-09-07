import { Module } from "@nestjs/common";
import { TemplateMigrationModule } from "../template-migration/template-migration.module";
import { TemplateService } from "./template.service";
import { TemplateController } from "./template.controller";

@Module({
  imports: [TemplateMigrationModule],
  controllers: [TemplateController],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
