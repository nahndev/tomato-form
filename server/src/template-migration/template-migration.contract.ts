/**
 * RabbitMQ request-response contract for fetching the live template
 * snapshot, shared (by manual duplication, same convention as
 * `submission-value.contract.ts`) with
 * `yjs-server/src/template-file/template-file.contract.ts`. Keep both in sync.
 *
 * Flow: `server` sends `GET_TEMPLATE_SNAPSHOT_PATTERN` onto `yjs_server_queue`
 * and awaits the reply. `yjs-server` reads the template's live draft doc and
 * replies with its widgets/layouts/widgetToSession/sessions, or `{ok: false}`
 * if there's no draft to publish.
 */
export const GET_TEMPLATE_SNAPSHOT_PATTERN = "template.get-snapshot";

export interface GetTemplateSnapshotRequest {
  templateId: string;
}

export type GetTemplateSnapshotResult =
  | {
      ok: true;
      widgets: Record<string, unknown>;
      layouts: Record<string, unknown>;
      widgetToSession: Record<string, unknown>;
      sessions: Record<string, unknown>;
    }
  | { ok: false; message: string };
