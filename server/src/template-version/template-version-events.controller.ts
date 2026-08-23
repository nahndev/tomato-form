import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { TemplateVersionService } from "./template-version.service";
import {
  VERSION_FILE_MADE_EVENT,
  VersionFileMadeEvent,
} from "./template-file.contract";

@Controller()
export class TemplateVersionEventsController {
  constructor(private readonly templateVersionService: TemplateVersionService) {}

  @EventPattern(VERSION_FILE_MADE_EVENT)
  async onVersionFileMade(@Payload() event: VersionFileMadeEvent): Promise<void> {
    await this.templateVersionService.createFromVersionFileEvent(event);
  }
}
