import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import type { GridLayout, WidgetProperties, WidgetType } from "@/types/template";

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

export interface WidgetSettingsFieldsProps {
  value: WidgetProperties;
  onChange: (patch: Partial<WidgetProperties>) => void;
}

export interface WidgetDefinition<TValue = unknown> {
  type: WidgetType;
  label: string;
  icon: LucideIcon;
  description: string;
  /** false for widgets that never collect an end-user value (break, session, button, label). */
  isDataField: boolean;
  /** Whether the properties panel shows the common "Placeholder" field. Defaults to true. */
  showPlaceholder?: boolean;
  /** Whether the properties panel shows the common "Required" toggle. Defaults to true. */
  showRequired?: boolean;
  Field: ComponentType<FieldComponentProps<TValue>>;
  /** Extra properties-panel fields beyond label/placeholder/required (e.g. an options editor). */
  SettingsFields?: ComponentType<WidgetSettingsFieldsProps>;
  defaultSettings: WidgetProperties;
  /** `idx` is intentionally excluded - it's always assigned at insertion time via generateKeyBetween. */
  defaultLayout: Omit<GridLayout, "idx">;
}

export type WidgetRegistry = Record<WidgetType, WidgetDefinition>;
