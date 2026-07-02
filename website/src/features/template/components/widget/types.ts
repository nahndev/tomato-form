import type {
  GridLayout,
  WidgetProperties,
  WidgetType,
} from "@/types/template";
import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

/**
 * "fill"    - the real interactive control, used on the submission-fill page.
 * "preview" - a static, non-interactive placeholder, used in the builder canvas.
 */
export type FieldMode = "fill" | "preview";

export interface FieldComponentProps<TValue = unknown> {
  widgetId: string;
  properties: WidgetProperties;
  mode: FieldMode;
  value?: TValue;
  onChange?: (value: TValue) => void;
}

export interface WidgetDefinition<TValue = unknown> {
  type: WidgetType;
  label: string;
  icon: LucideIcon;
  description: string;
  isDataField: boolean;
  Field: ComponentType<FieldComponentProps<TValue>>;
  defaultSettings: WidgetProperties;
  defaultLayout: Omit<GridLayout, "idx">;
}

export type WidgetRegistry = Record<WidgetType, WidgetDefinition>;
