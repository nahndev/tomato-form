/**
 * RabbitMQ fire-and-forget event contract for template publishing, shared
 * (by manual duplication, same convention as the old `.proto` file) with
 * `server/src/template-version/template-file.contract.ts`. Keep both in sync.
 *
 * Flow: `server` emits `MAKE_VERSION_FILE_EVENT` onto `yjs_server_queue`.
 * `yjs-server` makes the version file and emits `VERSION_FILE_MADE_EVENT`
 * back onto `server_queue`, where `server` creates the `TemplateVersion` row.
 * Neither side waits for a reply - if yjs-server finds no draft, it just
 * logs and doesn't emit anything back.
 */
export const MAKE_VERSION_FILE_EVENT = "template.make-version-file";
export const VERSION_FILE_MADE_EVENT = "template.version-file-made";

export interface MakeVersionFileEvent {
  templateId: string;
  version: string;
}

export interface VersionFileMadeEvent {
  templateId: string;
  version: string;
  path: string;
  widgets: Record<string, unknown>;
  layouts: Record<string, unknown>;
  widgetToSession: Record<string, unknown>;
  sessions: Record<string, unknown>;
}
