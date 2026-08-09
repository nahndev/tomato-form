import { Module } from "@nestjs/common";
import { TemplateVersionModule } from "../template-version/template-version.module";
import { TemplateService } from "./template.service";
import { TemplateController } from "./template.controller";

@Module({
  imports: [TemplateVersionModule],
  controllers: [TemplateController],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
