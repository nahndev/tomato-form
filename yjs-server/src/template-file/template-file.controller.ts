import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { TemplateFileService } from "@/template-file/template-file.service";
import {
  MAKE_VERSION_FILE_PATTERN,
  MakeVersionFileMessage,
  MakeVersionFileReply,
} from "@/template-file/template-file.contract";

@Controller()
export class TemplateFileController {
  constructor(private readonly templateFileService: TemplateFileService) {}

  @MessagePattern(MAKE_VERSION_FILE_PATTERN)
  makeVersionFile(@Payload() message: MakeVersionFileMessage): MakeVersionFileReply {
    return this.templateFileService.makeVersionFile(message.templateId, message.version);
  }
}
