import type { ButtonAction } from "@/types/button-action";
import type { WidgetType } from "@/types/widget";
import type { TomatoIconKey } from "@tomato/icon";
import type { SerializedEditorState } from "lexical";
import { CSSProperties } from "react";

/**
 * Category a widget type is filed under in the "ADD WIDGET" picker.
 * `SYSTEM` is reserved for widgets backed by platform data (e.g. `users`)
 * rather than author-entered content.
 */
export const WidgetGroup = {
  COMMON: "common",
  MEDIA: "media",
  ADVANCE: "advance",
  SYSTEM: "system",
  DEFAULT: "DEFAULT",
} as const;
export type WidgetGroup = (typeof WidgetGroup)[keyof typeof WidgetGroup];

export const TemplateMode = {
  VIEW: "view",
  EDIT: "edit",
} as const;
export type TemplateMode = (typeof TemplateMode)[keyof typeof TemplateMode];

/**
 * Fixed color palette tokens available across the design system.
 * Values are Tailwind's default `-500` shade (see `tailwindcss/theme.css`),
 * so they can be dropped straight into a `CSSProperties` value.
 */
export const ColorEnum = {
  RED: "#ef4444",
  ORANGE: "#f97316",
  YELLOW: "#eab308",
  GREEN: "#22c55e",
  BLUE: "#3b82f6",
  PURPLE: "#a855f7",
  PINK: "#ec4899",
  GRAY: "#6b7280",
  WHITE: "#ffffff",
} as const;
export type ColorEnum = (typeof ColorEnum)[keyof typeof ColorEnum];

export interface Widget extends WidgetProperties {
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

export const SessionConditionType = {
  ALWAYS: "always",
  BUTTON_CLICKED: "button-clicked",
  WIDGET_HAS_VALUE: "widget-has-value",
} as const;

export type SessionConditionType =
  (typeof SessionConditionType)[keyof typeof SessionConditionType];

export interface AlwaysCondition {
  type: typeof SessionConditionType.ALWAYS;
}

export interface ButtonClickedCondition {
  type: typeof SessionConditionType.BUTTON_CLICKED;
  widgetId: string;
}

export interface WidgetHasValueCondition {
  type: typeof SessionConditionType.WIDGET_HAS_VALUE;
  widgetId: string;
}

/** Gates whether a session is shown in the submission fill wizard. */
export type SessionCondition =
  | AlwaysCondition
  | ButtonClickedCondition
  | WidgetHasValueCondition;

export interface SessionProperties {
  name: string;
  icon?: TomatoIconKey;
  description?: SerializedEditorState;
  /** Unset = always shown (see `SessionConditionType.ALWAYS`). */
  condition?: SessionCondition;
}

export interface Session extends SessionProperties {
  id: string;
}

/**
 * Frozen copy of the yjs doc as of the last publish, as one schemaless blob
 * so new record kinds don't need a migration.
 */
export interface TemplateSnapshot {
  widgets: Record<string, Widget>;
  layouts: Record<string, GridLayout>;
  widgetToSession: Record<string, string>;
  sessions: Record<string, Session>;
}

export interface Template {
  id: string;
  name: string;
  /** Semantic version string (e.g. "1.0.0") of the currently published snapshot. Unset until first publish. */
  version?: string;
  snapshot: TemplateSnapshot;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTemplateInput {
  name: string;
}

export type UpdateTemplateInput = Partial<CreateTemplateInput>;
