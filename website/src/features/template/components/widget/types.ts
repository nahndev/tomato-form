import type {
  GridLayout,
  WidgetGroup,
  WidgetProperties,
  WidgetType,
} from "@/types/template";
import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

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
