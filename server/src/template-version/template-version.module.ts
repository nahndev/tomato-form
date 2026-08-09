import { Module } from "@nestjs/common";
import { TemplateVersionService } from "./template-version.service";

@Module({
  providers: [TemplateVersionService],
  exports: [TemplateVersionService],
})
export class TemplateVersionModule {}
