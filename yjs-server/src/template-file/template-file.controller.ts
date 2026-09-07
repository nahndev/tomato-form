import { TemplateFileService } from "@/template-file/template-file.service";
import {
  GET_TEMPLATE_SNAPSHOT_PATTERN,
  GetTemplateSnapshotRequest,
  GetTemplateSnapshotResult,
} from "@/template-file/template-file.contract";
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class TemplateFileController {
  constructor(private readonly templateFileService: TemplateFileService) {}

  @MessagePattern(GET_TEMPLATE_SNAPSHOT_PATTERN)
  getSnapshot(@Payload() message: GetTemplateSnapshotRequest): GetTemplateSnapshotResult {
    return this.templateFileService.getCurrentSnapshot(message.templateId);
  }
}
