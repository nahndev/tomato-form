import type { WidgetProperties, WidgetType } from "@/types/template";
import type { ComponentType } from "react";

export type WidgetPropertyKey = keyof WidgetProperties;

export interface WidgetPropertyFieldProps<
  K extends WidgetPropertyKey = WidgetPropertyKey,
> {
  widgetType: WidgetType;
  value: WidgetProperties[K];
  onChange: (value: WidgetProperties[K]) => void;
}

export interface WidgetPropertyDescriptor {
  key: WidgetPropertyKey;
  label: string;
  Component: ComponentType<WidgetPropertyFieldProps>;
}

export type WidgetPropertyRegistry = Record<
  WidgetType,
  WidgetPropertyDescriptor[]
>;
