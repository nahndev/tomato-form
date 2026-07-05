import { ContentDescriptor } from "@/features/template/components/toolbar/property/descriptors/ContentDescriptor";
import { LabelDescriptor } from "@/features/template/components/toolbar/property/descriptors/LabelDescriptor";
import { OptionsDescriptor } from "@/features/template/components/toolbar/property/descriptors/OptionsDescriptor";
import { PlaceholderDescriptor } from "@/features/template/components/toolbar/property/descriptors/PlaceholderDescriptor";
import { RequiredDescriptor } from "@/features/template/components/toolbar/property/descriptors/RequiredDescriptor";
import { TextFormatDescriptor } from "@/features/template/components/toolbar/property/descriptors/TextFormatDescriptor";
import { UrlDescriptor } from "@/features/template/components/toolbar/property/descriptors/UrlDescriptor";
import type {
  WidgetPropertyDescriptor,
  WidgetPropertyRegistry,
} from "@/features/template/components/toolbar/property/types";

const LABEL: WidgetPropertyDescriptor = {
  key: "label",
  label: "Label",
  Component: LabelDescriptor,
};

const PLACEHOLDER: WidgetPropertyDescriptor = {
  key: "placeholder",
  label: "Placeholder",
  Component: PlaceholderDescriptor,
};

const REQUIRED: WidgetPropertyDescriptor = {
  key: "required",
  label: "Required",
  Component: RequiredDescriptor,
};

const OPTIONS: WidgetPropertyDescriptor = {
  key: "options",
  label: "Options",
  Component: OptionsDescriptor,
};

const CONTENT: WidgetPropertyDescriptor = {
  key: "content",
  label: "Content",
  Component: ContentDescriptor,
};

const LINK_URL: WidgetPropertyDescriptor = {
  key: "url",
  label: "Link URL",
  Component: UrlDescriptor,
};

const LABEL_FORMAT: WidgetPropertyDescriptor = {
  key: "labelStyle",
  label: "",
  Component: TextFormatDescriptor,
};

/**
 * Property-editing components per widget type, decoupled from
 * `widget/registry.ts`. Each entry's `key` is a key of `WidgetProperties`;
 * `WidgetPropertyContent` renders one field per entry, in list order, and
 * writes edits back via `useWidgetActions().setProperty(widgetId, key, value)`.
 */
export const WIDGET_PROPERTY_REGISTRY: WidgetPropertyRegistry = {
  text: [LABEL, PLACEHOLDER, REQUIRED],
  "text-area": [LABEL, PLACEHOLDER, REQUIRED],
  number: [LABEL, PLACEHOLDER, REQUIRED],
  date: [LABEL, PLACEHOLDER, REQUIRED],
  datetime: [LABEL, PLACEHOLDER, REQUIRED],
  time: [LABEL, PLACEHOLDER, REQUIRED],
  select: [LABEL, PLACEHOLDER, REQUIRED, OPTIONS],
  checkbox: [LABEL, PLACEHOLDER, REQUIRED, OPTIONS],
  radio: [LABEL, PLACEHOLDER, REQUIRED, OPTIONS],
  label: [LABEL, LABEL_FORMAT],
  signature: [LABEL, REQUIRED],
  button: [LABEL, LINK_URL],
  "image-uploader": [LABEL, REQUIRED],
  "file-uploader": [LABEL, REQUIRED],
  break: [],
  session: [LABEL],
};
