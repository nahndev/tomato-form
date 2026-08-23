import type {
  GridLayout,
  WidgetGroup,
  WidgetProperties,
} from "@/types/template";
import type { TomatoIconKey } from "@tomato/icon";
import type { ComponentType } from "react";

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
  CREATED_AT = "created-at",
  TEMPLATE = "template",
  SUBMITTED_BY = "submitted-by",
}

export interface FieldComponentProps<TValue = unknown> {
  widgetId: string;
  properties: WidgetProperties;
  value?: TValue;
  onChange?: (value: TValue) => void;
}

export interface WidgetDefinition<TValue = unknown> {
  type: WidgetType;
  label: string;
  icon: TomatoIconKey;
  description: string;
  isDataField: boolean;
  group: WidgetGroup;
  component: ComponentType<FieldComponentProps<TValue>>;
  defaultSettings: WidgetProperties;
  defaultLayout: Omit<GridLayout, "idx">;
}

export type WidgetRegistry = Record<WidgetType, WidgetDefinition>;
