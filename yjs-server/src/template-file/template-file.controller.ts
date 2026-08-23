import { SERVER_CLIENT } from "@/rabbitmq/rabbitmq.constants";
import { TemplateFileService } from "@/template-file/template-file.service";
import {
  MAKE_VERSION_FILE_EVENT,
  MakeVersionFileEvent,
  VERSION_FILE_MADE_EVENT,
} from "@/template-file/template-file.contract";
import { Controller, Inject, Logger } from "@nestjs/common";
import { ClientProxy, EventPattern, Payload } from "@nestjs/microservices";

@Controller()
export class TemplateFileController {
  private readonly logger = new Logger(TemplateFileController.name);

  constructor(
    private readonly templateFileService: TemplateFileService,
    @Inject(SERVER_CLIENT) private readonly serverClient: ClientProxy,
  ) {}

  @EventPattern(MAKE_VERSION_FILE_EVENT)
  makeVersionFile(@Payload() message: MakeVersionFileEvent): void {
    const result = this.templateFileService.makeVersionFile(
      message.templateId,
      message.version,
    );

    if (!result.ok) {
      this.logger.warn(
        `Could not make version file for template ${message.templateId}: ${result.message}`,
      );
      return;
    }

    this.serverClient.emit(VERSION_FILE_MADE_EVENT, result.event);
  }
}
