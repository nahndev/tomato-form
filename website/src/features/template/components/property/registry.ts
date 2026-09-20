import {
  PropertyKey,
  type WidgetPropertyRegistry,
} from "@/features/template/components/property/types";
import { WidgetType } from "@/types/widget";

const {
  Label,
  Placeholder,
  Required,
  Options,
  Content,
  Actions,
  TextStyle,
  ContainerStyle,
} = PropertyKey;

/**
 * Property keys shown per widget type, decoupled from `widget/registry.ts`.
 * Each key is looked up in `PROPERTY_DESCRIPTOR_REGISTRY`
 * (`descriptors/registry.ts`) for its label/field component.
 * `WidgetPropertyContent` renders one field per key, in list order, and
 * writes edits back via `useWidgetActions().setProperty(widgetId, key, value)`.
 */
export const WIDGET_PROPERTY_REGISTRY: WidgetPropertyRegistry = {
  [WidgetType.TEXT]: [Label, Placeholder, Required],
  [WidgetType.TEXT_AREA]: [Label, Placeholder, Required],
  [WidgetType.NUMBER]: [Label, Placeholder, Required],
  [WidgetType.DATE]: [Label, Placeholder, Required],
  [WidgetType.DATETIME]: [Label, Placeholder, Required],
  [WidgetType.TIME]: [Label, Placeholder, Required],
  [WidgetType.SELECT]: [Label, Placeholder, Required, Options],
  [WidgetType.CHECKBOX]: [Label, Placeholder, Required, Options],
  [WidgetType.RADIO]: [Label, Placeholder, Required, Options],
  [WidgetType.LABEL]: [Label, Content],
  [WidgetType.SIGNATURE]: [Label, Required],
  [WidgetType.BUTTON]: [Label, Actions, TextStyle, ContainerStyle],
  [WidgetType.IMAGE_UPLOADER]: [Label, Required],
  [WidgetType.FILE_UPLOADER]: [Label, Required],
  [WidgetType.BOARD]: [Label, Required],
  [WidgetType.BREAK]: [],
  [WidgetType.SESSION]: [Label],
  [WidgetType.USERS]: [Label, Required],
  [WidgetType.CREATED_AT]: [Label],
  [WidgetType.TEMPLATE]: [Label],
  [WidgetType.SUBMITTED_BY]: [Label],
};
