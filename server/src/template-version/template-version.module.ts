import { Module } from "@nestjs/common";
import { TemplateFileClient } from "./template-file.client";
import { TemplateVersionService } from "./template-version.service";

@Module({
  providers: [TemplateVersionService, TemplateFileClient],
  exports: [TemplateVersionService],
})
export class TemplateVersionModule {}
