import { ContainerStyleDescriptor } from "@/features/template/components/property/descriptors/ContainerStyleDescriptor";
import { ContentDescriptor } from "@/features/template/components/property/descriptors/ContentDescriptor";
import { LabelDescriptor } from "@/features/template/components/property/descriptors/LabelDescriptor";
import { OptionsDescriptor } from "@/features/template/components/property/descriptors/OptionsDescriptor";
import { PlaceholderDescriptor } from "@/features/template/components/property/descriptors/PlaceholderDescriptor";
import { RequiredDescriptor } from "@/features/template/components/property/descriptors/RequiredDescriptor";
import { TextStyleDescriptor } from "@/features/template/components/property/descriptors/TextStyleDescriptor";
import { UrlDescriptor } from "@/features/template/components/property/descriptors/UrlDescriptor";
import type {
  WidgetPropertyDescriptor,
  WidgetPropertyFieldProps,
  WidgetPropertyRegistry,
} from "@/features/template/components/property/types";
import { WidgetType } from "@/types/template";
import type { ComponentType } from "react";

const LABEL: WidgetPropertyDescriptor = {
  key: "label",
  label: "Label",
  Component: LabelDescriptor as ComponentType<WidgetPropertyFieldProps>,
};

const PLACEHOLDER: WidgetPropertyDescriptor = {
  key: "placeholder",
  label: "Placeholder",
  Component: PlaceholderDescriptor as ComponentType<WidgetPropertyFieldProps>,
};

const REQUIRED: WidgetPropertyDescriptor = {
  key: "required",
  label: "Required",
  Component: RequiredDescriptor as ComponentType<WidgetPropertyFieldProps>,
};

const OPTIONS: WidgetPropertyDescriptor = {
  key: "options",
  label: "Options",
  Component: OptionsDescriptor as ComponentType<WidgetPropertyFieldProps>,
};

const CONTENT: WidgetPropertyDescriptor = {
  key: "content",
  label: "Content",
  Component: ContentDescriptor as ComponentType<WidgetPropertyFieldProps>,
};

const LINK_URL: WidgetPropertyDescriptor = {
  key: "url",
  label: "Link URL",
  Component: UrlDescriptor as ComponentType<WidgetPropertyFieldProps>,
};

const TextStyle: WidgetPropertyDescriptor = {
  key: "textStyle",
  label: "",
  Component: TextStyleDescriptor as ComponentType<WidgetPropertyFieldProps>,
};

const CONTAINER_STYLE: WidgetPropertyDescriptor = {
  key: "containerStyle",
  label: "Style",
  Component:
    ContainerStyleDescriptor as ComponentType<WidgetPropertyFieldProps>,
};

/**
 * Property-editing components per widget type, decoupled from
 * `widget/registry.ts`. Each entry's `key` is a key of `WidgetProperties`;
 * `WidgetPropertyContent` renders one field per entry, in list order, and
 * writes edits back via `useWidgetActions().setProperty(widgetId, key, value)`.
 */
export const WIDGET_PROPERTY_REGISTRY: WidgetPropertyRegistry = {
  [WidgetType.TEXT]: [LABEL, PLACEHOLDER, REQUIRED],
  [WidgetType.TEXT_AREA]: [LABEL, PLACEHOLDER, REQUIRED],
  [WidgetType.NUMBER]: [LABEL, PLACEHOLDER, REQUIRED],
  [WidgetType.DATE]: [LABEL, PLACEHOLDER, REQUIRED],
  [WidgetType.DATETIME]: [LABEL, PLACEHOLDER, REQUIRED],
  [WidgetType.TIME]: [LABEL, PLACEHOLDER, REQUIRED],
  [WidgetType.SELECT]: [LABEL, PLACEHOLDER, REQUIRED, OPTIONS],
  [WidgetType.CHECKBOX]: [LABEL, PLACEHOLDER, REQUIRED, OPTIONS],
  [WidgetType.RADIO]: [LABEL, PLACEHOLDER, REQUIRED, OPTIONS],
  [WidgetType.LABEL]: [LABEL, CONTENT, TextStyle],
  [WidgetType.SIGNATURE]: [LABEL, REQUIRED],
  [WidgetType.BUTTON]: [LABEL, LINK_URL, TextStyle, CONTAINER_STYLE],
  [WidgetType.IMAGE_UPLOADER]: [LABEL, REQUIRED],
  [WidgetType.FILE_UPLOADER]: [LABEL, REQUIRED],
  [WidgetType.BREAK]: [],
  [WidgetType.SESSION]: [LABEL],
  [WidgetType.USERS]: [LABEL, REQUIRED],
};
