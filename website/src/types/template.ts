import type { SerializedEditorState } from "lexical";
import { CSSProperties } from "react";

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

/**
 * Fixed color palette tokens available across the design system.
 * Values are Tailwind's default `-500` shade (see `tailwindcss/theme.css`),
 * so they can be dropped straight into a `CSSProperties` value.
 */
export enum ColorEnum {
  RED = "#ef4444",
  ORANGE = "#f97316",
  YELLOW = "#eab308",
  GREEN = "#22c55e",
  BLUE = "#3b82f6",
  PURPLE = "#a855f7",
  PINK = "#ec4899",
  GRAY = "#6b7280",
  WHITE = "#ffffff",
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
  content?: SerializedEditorState;
  url?: string;
  compact?: boolean;
  labelStyle?: CSSProperties;
  containerStyle?: CSSProperties;
}

export interface Session {
  id: string;
  name: string;
  /** Key into `ICON_REGISTRY` (see `components/ui/icon-picker`). */
  icon?: string;
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
