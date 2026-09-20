import { ActionsDescriptor } from "@/features/template/components/property/descriptors/ActionsDescriptor";
import { ContainerStyleDescriptor } from "@/features/template/components/property/descriptors/ContainerStyleDescriptor";
import { ContentDescriptor } from "@/features/template/components/property/descriptors/ContentDescriptor";
import { LabelDescriptor } from "@/features/template/components/property/descriptors/LabelDescriptor";
import { OptionsDescriptor } from "@/features/template/components/property/descriptors/OptionsDescriptor";
import { PlaceholderDescriptor } from "@/features/template/components/property/descriptors/PlaceholderDescriptor";
import { RequiredDescriptor } from "@/features/template/components/property/descriptors/RequiredDescriptor";
import { TextStyleDescriptor } from "@/features/template/components/property/descriptors/TextStyleDescriptor";
import {
  PropertyKey,
  type WidgetPropertyDescriptorRegistry,
  type WidgetPropertyFieldProps,
} from "@/features/template/components/property/types";
import type { ComponentType } from "react";

/**
 * Property information (label, field component) keyed by `WidgetPropertyKey`,
 * decoupled from which widget types show it. `WIDGET_PROPERTY_REGISTRY`
 * (`../registry.ts`) lists only the keys per `WidgetType`; this is where a
 * key resolves to what to render for it.
 */
export const PROPERTY_DESCRIPTOR_REGISTRY: WidgetPropertyDescriptorRegistry = {
  [PropertyKey.Label]: {
    label: "Label",
    Component: LabelDescriptor as ComponentType<WidgetPropertyFieldProps>,
  },
  [PropertyKey.Placeholder]: {
    label: "Placeholder",
    Component: PlaceholderDescriptor as ComponentType<WidgetPropertyFieldProps>,
  },
  [PropertyKey.Required]: {
    label: "Required",
    Component: RequiredDescriptor as ComponentType<WidgetPropertyFieldProps>,
  },
  [PropertyKey.Options]: {
    label: "Options",
    Component: OptionsDescriptor as ComponentType<WidgetPropertyFieldProps>,
  },
  [PropertyKey.Content]: {
    label: "Content",
    Component: ContentDescriptor as ComponentType<WidgetPropertyFieldProps>,
  },
  [PropertyKey.Actions]: {
    label: "Actions",
    Component: ActionsDescriptor as ComponentType<WidgetPropertyFieldProps>,
  },
  [PropertyKey.TextStyle]: {
    label: "",
    Component: TextStyleDescriptor as ComponentType<WidgetPropertyFieldProps>,
  },
  [PropertyKey.ContainerStyle]: {
    label: "Style",
    Component: ContainerStyleDescriptor as ComponentType<WidgetPropertyFieldProps>,
  },
};
