/**
 * RabbitMQ request/reply contract for the `MakeVersionFile` message, shared
 * (by manual duplication, same as the old `.proto` file) with
 * `server/src/template-version/template-file.contract.ts`. Keep both in sync.
 */
export const MAKE_VERSION_FILE_PATTERN = "template.make-version-file";

export interface MakeVersionFileMessage {
  templateId: string;
  version: string;
}

export interface MakeVersionFileSuccess {
  ok: true;
  path: string;
  widgets: Record<string, unknown>;
  layouts: Record<string, unknown>;
  widgetToSession: Record<string, unknown>;
  properties: Record<string, unknown>;
  sessions: Record<string, unknown>;
  sessionProperties: Record<string, unknown>;
}

export interface MakeVersionFileNotFound {
  ok: false;
  code: "NOT_FOUND";
  message: string;
}

export type MakeVersionFileReply = MakeVersionFileSuccess | MakeVersionFileNotFound;
