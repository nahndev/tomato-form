import { RABBITMQ_CLIENT } from "@/rabbitmq/rabbitmq.constants";
import type {
  GridLayout,
  Session,
  SessionProperties,
  Widget,
  WidgetProperties,
} from "@/template/template.types";
import {
  Inject,
  Injectable,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, timeout, TimeoutError } from "rxjs";
import {
  MAKE_VERSION_FILE_PATTERN,
  MakeVersionFileReply,
} from "./template-file.contract";

export const MAKE_VERSION_FILE_TIMEOUT_MS = 30_000;

export interface MakeVersionFileResult {
  path: string;
  widgets: Record<string, Widget>;
  layouts: Record<string, GridLayout>;
  widgetToSession: Record<string, string>;
  properties: Record<string, WidgetProperties>;
  sessions: Record<string, Session>;
  sessionProperties: Record<string, SessionProperties>;
}

@Injectable()
export class TemplateFileClient {
  constructor(@Inject(RABBITMQ_CLIENT) private readonly client: ClientProxy) {}

  /** Publishes the template's live draft as `version`, returning the new snapshot's path and widget records. */
  async makeVersionFile(id: string, version: string): Promise<MakeVersionFileResult> {
    let reply: MakeVersionFileReply;
    try {
      reply = await firstValueFrom(
        this.client
          .send<MakeVersionFileReply>(MAKE_VERSION_FILE_PATTERN, {
            templateId: id,
            version,
          })
          .pipe(timeout(MAKE_VERSION_FILE_TIMEOUT_MS)),
      );
    } catch (err) {
      if (err instanceof TimeoutError) {
        throw new ServiceUnavailableException(
          `Timed out waiting for yjs-server to publish template ${id}`,
        );
      }
      throw new ServiceUnavailableException(
        `Could not reach yjs-server to publish template ${id}: ${(err as Error).message}`,
      );
    }

    if (!reply.ok) {
      throw new UnprocessableEntityException(reply.message);
    }

    return {
      path: reply.path,
      widgets: reply.widgets as Record<string, Widget>,
      layouts: reply.layouts as Record<string, GridLayout>,
      widgetToSession: reply.widgetToSession as Record<string, string>,
      properties: reply.properties as Record<string, WidgetProperties>,
      sessions: reply.sessions as Record<string, Session>,
      sessionProperties: reply.sessionProperties as Record<string, SessionProperties>,
    };
  }
}
