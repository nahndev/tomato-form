import type {
  GridLayout,
  Widget,
  WidgetGroup,
  WidgetProperties,
} from "@/types/template";
import type { TomatoIconKey } from "@tomato/icon";
import type { ComponentType } from "react";

export const WidgetType = {
  TEXT: "text",
  TEXT_AREA: "text-area",
  NUMBER: "number",
  DATE: "date",
  DATETIME: "datetime",
  TIME: "time",
  SELECT: "select",
  CHECKBOX: "checkbox",
  RADIO: "radio",
  LABEL: "label",
  SIGNATURE: "signature",
  BUTTON: "button",
  IMAGE_UPLOADER: "image-uploader",
  FILE_UPLOADER: "file-uploader",
  BREAK: "break",
  SESSION: "session",
  USERS: "users",
  CREATED_AT: "created-at",
  TEMPLATE: "template",
  SUBMITTED_BY: "submitted-by",
} as const;
export type WidgetType = (typeof WidgetType)[keyof typeof WidgetType];

export interface FieldComponentProps<TValue = unknown> {
  widget: Widget;
  value?: TValue;
  onChange?: (value: TValue) => void;
}

/** Pure data describing a widget type - no React involved. */
export interface WidgetItemDefinition {
  type: WidgetType;
  label: string;
  icon: TomatoIconKey;
  description: string;
  isDataField: boolean;
  group: WidgetGroup;
  defaultSettings: WidgetProperties;
  defaultLayout: Omit<GridLayout, "idx">;
}

export type WidgetItemRegistry = Record<WidgetType, WidgetItemDefinition>;

/** The React component that renders a widget type's field. */
export type WidgetComponent<TValue = unknown> = ComponentType<
  FieldComponentProps<TValue>
>;

export type WidgetComponentRegistry = Record<WidgetType, WidgetComponent>;
