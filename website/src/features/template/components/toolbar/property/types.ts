import type { WidgetProperties, WidgetType } from "@/types/template";
import type { ComponentType } from "react";

export type WidgetPropertyKey = keyof WidgetProperties;

export interface WidgetPropertyFieldProps {
  widgetType: WidgetType;
  value: WidgetProperties;
  onChange: (value: WidgetProperties[WidgetPropertyKey]) => void;
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
