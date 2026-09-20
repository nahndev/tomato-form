import type { WidgetProperties } from "@/types/template";
import type { WidgetType } from "@/types/widget";
import type { ComponentType } from "react";

export type WidgetPropertyKey = keyof WidgetProperties;

/**
 * Canonical `WidgetPropertyKey` values. `WIDGET_PROPERTY_REGISTRY` and
 * `PROPERTY_DESCRIPTOR_REGISTRY` reference these instead of magic strings,
 * so a typo fails to compile rather than silently dropping a property.
 */
export const PropertyKey = {
  Label: "label",
  Placeholder: "placeholder",
  Required: "required",
  Options: "options",
  Content: "content",
  Actions: "actions",
  TextStyle: "textStyle",
  ContainerStyle: "containerStyle",
} as const satisfies Record<string, WidgetPropertyKey>;

export interface WidgetPropertyFieldProps<
  K extends WidgetPropertyKey = WidgetPropertyKey,
> {
  widgetType: WidgetType;
  value: WidgetProperties[K];
  onChange: (value: WidgetProperties[K]) => void;
}

export interface WidgetPropertyDescriptor {
  label: string;
  Component: ComponentType<WidgetPropertyFieldProps>;
}

/** Property information (label, field component) keyed by `WidgetPropertyKey`. */
export type WidgetPropertyDescriptorRegistry = Partial<
  Record<WidgetPropertyKey, WidgetPropertyDescriptor>
>;

/** Property keys shown per `WidgetType`, in display order. */
export type WidgetPropertyRegistry = Record<WidgetType, WidgetPropertyKey[]>;
