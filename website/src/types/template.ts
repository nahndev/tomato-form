import type { SerializedEditorState } from "lexical";
import { CSSProperties } from "react";
import type { ButtonAction } from "@/types/button-action";
import type { WidgetType } from "@/types/widget";

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
  /** BUTTON only - ordered list of actions run in sequence on click. */
  actions?: ButtonAction[];
  compact?: boolean;
  textStyle?: CSSProperties;
  containerStyle?: CSSProperties;
}

export enum SessionConditionType {
  ALWAYS = "always",
  BUTTON_CLICKED = "button-clicked",
  WIDGET_HAS_VALUE = "widget-has-value",
}

export interface AlwaysCondition {
  type: SessionConditionType.ALWAYS;
}

export interface ButtonClickedCondition {
  type: SessionConditionType.BUTTON_CLICKED;
  widgetId: string;
}

export interface WidgetHasValueCondition {
  type: SessionConditionType.WIDGET_HAS_VALUE;
  widgetId: string;
}

/** Gates whether a session is shown in the submission fill wizard. */
export type SessionCondition =
  | AlwaysCondition
  | ButtonClickedCondition
  | WidgetHasValueCondition;

export interface Session {
  id: string;
}

export interface SessionProperties {
  name: string;
  /** `TomatoIconKey` from `@tomato/icon`. */
  icon?: string;
  description?: SerializedEditorState;
  /** Unset = always shown (see `SessionConditionType.ALWAYS`). */
  condition?: SessionCondition;
}

/**
 * Frozen copy of the yjs doc at publish time, as one schemaless blob so new
 * record kinds don't need a migration.
 */
export interface TemplateVersionSnapshot {
  widgets: Record<string, Widget>;
  properties: Record<string, WidgetProperties>;
  layouts: Record<string, GridLayout>;
  widgetToSession: Record<string, string>;
  sessions: Record<string, Session>;
  sessionProperties: Record<string, SessionProperties>;
}

export interface TemplateVersion {
  id: string;
  templateId: string;
  /** Semantic version string (e.g. "1.0.0"). */
  version: string;
  snapshot: TemplateVersionSnapshot;
  createdAt: string;
  /** Only present when fetched via `/template-versions/{id}`. */
  template?: { id: string; name: string };
}

export interface Template {
  id: string;
  name: string;
  templateVersions?: TemplateVersion[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTemplateInput {
  name: string;
}

export type UpdateTemplateInput = Partial<CreateTemplateInput>;
