import { CSSProperties } from "react";
import type { SerializedEditorState } from "lexical";

export enum WidgetType {
  TEXT = "text",
  TEXT_AREA = "text-area",
  NUMBER = "number",
  DATE = "date",
  DATETIME = "datetime",
  TIME = "time",
  SELECT = "select",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  LABEL = "label",
  SIGNATURE = "signature",
  BUTTON = "button",
  IMAGE_UPLOADER = "image-uploader",
  FILE_UPLOADER = "file-uploader",
  BREAK = "break",
  SESSION = "session",
  USERS = "users",
}

/**
 * Category a widget type is filed under in the "ADD WIDGET" picker.
 * `SYSTEM` is reserved for widgets backed by platform data (e.g. `users`)
 * rather than author-entered content.
 */
export enum WidgetGroup {
  COMMON = "common",
  MEDIA = "media",
  ADVANCE = "advance",
  SYSTEM = "system",
}

export enum TemplateMode {
  VIEW = "view",
  EDIT = "edit",
}

export interface Widget {
  id: string;
  type: WidgetType;
}

export interface GridLayout {
  column: number;
  span: number;
  idx: string;
  isStatic?: boolean;
  isFullWidth?: boolean;
}

export interface TextFormatProperties {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}
export interface WidgetProperties {
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  /** Static display text for the `label` widget, as a serialized lexical editor state. */
  content?: SerializedEditorState;
  /** Target URL the `button` widget opens on click. */
  url?: string;
  compact?: boolean;
  labelStyle?: CSSProperties;
}

export interface Session {
  id: string;
  name: string;
}

export interface TemplateVersion {
  id: string;
  templateId: string;
  /** Semantic version string (e.g. "1.0.0"). */
  version: string;
  createdAt: string;
}

export interface Template {
  id: string;
  name: string;
  widgets: Record<string, Widget>;
  properties: Record<string, WidgetProperties>;
  sessions: Record<string, Session>;
  layouts: Record<string, GridLayout>;
  widgetToSession: Record<string, string>;
  templateVersions?: TemplateVersion[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTemplateInput {
  name: string;
  widgets?: Record<string, Widget>;
  properties?: Record<string, WidgetProperties>;
  sessions?: Record<string, Session>;
  layouts?: Record<string, GridLayout>;
  widgetToSession?: Record<string, string>;
}

export type UpdateTemplateInput = Partial<CreateTemplateInput>;
