import { WidgetType } from "@/types/template";
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
  [WidgetType.TEXT]: [LABEL, PLACEHOLDER, REQUIRED],
  [WidgetType.TEXT_AREA]: [LABEL, PLACEHOLDER, REQUIRED],
  [WidgetType.NUMBER]: [LABEL, PLACEHOLDER, REQUIRED],
  [WidgetType.DATE]: [LABEL, PLACEHOLDER, REQUIRED],
  [WidgetType.DATETIME]: [LABEL, PLACEHOLDER, REQUIRED],
  [WidgetType.TIME]: [LABEL, PLACEHOLDER, REQUIRED],
  [WidgetType.SELECT]: [LABEL, PLACEHOLDER, REQUIRED, OPTIONS],
  [WidgetType.CHECKBOX]: [LABEL, PLACEHOLDER, REQUIRED, OPTIONS],
  [WidgetType.RADIO]: [LABEL, PLACEHOLDER, REQUIRED, OPTIONS],
  [WidgetType.LABEL]: [LABEL, CONTENT],
  [WidgetType.SIGNATURE]: [LABEL, REQUIRED],
  [WidgetType.BUTTON]: [LABEL, LINK_URL],
  [WidgetType.IMAGE_UPLOADER]: [LABEL, REQUIRED],
  [WidgetType.FILE_UPLOADER]: [LABEL, REQUIRED],
  [WidgetType.BREAK]: [],
  [WidgetType.SESSION]: [LABEL],
};
