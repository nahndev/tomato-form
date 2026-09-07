import { RABBITMQ_CLIENT } from "@/rabbitmq/rabbitmq.constants";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, timeout } from "rxjs";
import {
  GET_TEMPLATE_SNAPSHOT_PATTERN,
  GetTemplateSnapshotResult,
} from "./template-migration.contract";

const SNAPSHOT_REQUEST_TIMEOUT_MS = 10_000;

@Injectable()
export class TemplateSnapshotClient {
  constructor(@Inject(RABBITMQ_CLIENT) private readonly client: ClientProxy) {}

  /** Asks yjs-server for the template's live draft, as widgets/layouts/widgetToSession/sessions. */
  getSnapshot(templateId: string): Promise<GetTemplateSnapshotResult> {
    return firstValueFrom(
      this.client
        .send<GetTemplateSnapshotResult>(GET_TEMPLATE_SNAPSHOT_PATTERN, {
          templateId,
        })
        .pipe(timeout(SNAPSHOT_REQUEST_TIMEOUT_MS)),
    );
  }
}
