import type {
  GridLayout,
  WidgetGroup,
  WidgetProperties,
} from "@/types/template";
import type { LucideIcon } from "lucide-react";
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
  icon: LucideIcon;
  description: string;
  isDataField: boolean;
  group: WidgetGroup;
  component: ComponentType<FieldComponentProps<TValue>>;
  defaultSettings: WidgetProperties;
  defaultLayout: Omit<GridLayout, "idx">;
}

export type WidgetRegistry = Record<WidgetType, WidgetDefinition>;
