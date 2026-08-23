import { RABBITMQ_CLIENT } from "@/rabbitmq/rabbitmq.constants";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { MAKE_VERSION_FILE_EVENT } from "./template-file.contract";

@Injectable()
export class TemplateFileClient {
  constructor(@Inject(RABBITMQ_CLIENT) private readonly client: ClientProxy) {}

  /** Fire-and-forget: asks yjs-server to publish the template's live draft as `version`. */
  makeVersionFile(templateId: string, version: string): void {
    this.client.emit(MAKE_VERSION_FILE_EVENT, { templateId, version });
  }
}
