import { DisplayType } from "@/types/display-type";
import { ConstType } from "@/types/utils";
import { WidgetType } from "@/types/widget";

export const ValueProperty = {
  DEFAULT: "default",
  DATE: "date",
  TIME: "time",
} as const;
export type ValueProperty = ConstType<typeof ValueProperty>;

/**
 * Which value-properties a widget type exposes (a "property of the value", not of the
 * widget's own settings - see docs/v1.0.0/add-column-cell-property.md), and which
 * DisplayType(s) each one may render as. Replaces WIDGET_DISPLAY_TYPE_REGISTRY.
 * Only `datetime` has more than one property.
 */
export const WIDGET_VALUE_PROPERTY_REGISTRY: Record<WidgetType, Partial<Record<ValueProperty, DisplayType[]>>> = {
  [WidgetType.TEXT]: { [ValueProperty.DEFAULT]: [DisplayType.TEXT] },
  [WidgetType.TEXT_AREA]: { [ValueProperty.DEFAULT]: [DisplayType.TEXT] },
  [WidgetType.NUMBER]: { [ValueProperty.DEFAULT]: [DisplayType.NUMBER] },
  [WidgetType.DATE]: { [ValueProperty.DEFAULT]: [DisplayType.DATE, DisplayType.TEXT] },
  [WidgetType.DATETIME]: {
    [ValueProperty.DEFAULT]: [DisplayType.DATETIME, DisplayType.TEXT, DisplayType.DATE, DisplayType.TIME],
    [ValueProperty.DATE]: [DisplayType.DATE, DisplayType.TEXT],
    [ValueProperty.TIME]: [DisplayType.TIME, DisplayType.TEXT],
  },
  [WidgetType.TIME]: { [ValueProperty.DEFAULT]: [DisplayType.TIME, DisplayType.TEXT] },
  [WidgetType.SELECT]: { [ValueProperty.DEFAULT]: [DisplayType.TEXT] },
  [WidgetType.CHECKBOX]: { [ValueProperty.DEFAULT]: [DisplayType.TEXT] },
  [WidgetType.RADIO]: { [ValueProperty.DEFAULT]: [DisplayType.TEXT] },
  [WidgetType.LABEL]: {},
  [WidgetType.SIGNATURE]: { [ValueProperty.DEFAULT]: [DisplayType.TEXT] },
  [WidgetType.BUTTON]: {},
  [WidgetType.IMAGE_UPLOADER]: { [ValueProperty.DEFAULT]: [DisplayType.TEXT] },
  [WidgetType.FILE_UPLOADER]: { [ValueProperty.DEFAULT]: [DisplayType.TEXT] },
  [WidgetType.BREAK]: {},
  [WidgetType.SESSION]: {},
  [WidgetType.USERS]: { [ValueProperty.DEFAULT]: [DisplayType.TEXT] },
  [WidgetType.CREATED_AT]: { [ValueProperty.DEFAULT]: [DisplayType.DATE, DisplayType.TEXT] },
  [WidgetType.TEMPLATE]: {},
  [WidgetType.SUBMITTED_BY]: { [ValueProperty.DEFAULT]: [DisplayType.TEXT] },
  [WidgetType.BOARD]: {},
};

/** Every value-property a widget type exposes, in registry order (`default` always first). */
export function getWidgetValueProperties(type: WidgetType): ValueProperty[] {
  return Object.keys(WIDGET_VALUE_PROPERTY_REGISTRY[type]) as ValueProperty[];
}

/** Which DisplayTypes a given (widgetType, property) pair may render as; empty if the property doesn't exist on that widget. */
export function getPropertyDisplayTypes(type: WidgetType, property: ValueProperty): DisplayType[] {
  return WIDGET_VALUE_PROPERTY_REGISTRY[type][property] ?? [];
}

/** The dedup'd union of DisplayTypes across every property a widget type exposes - "can this widget go in a column at all". */
export function getWidgetDisplayTypes(type: WidgetType): DisplayType[] {
  return Array.from(new Set(Object.values(WIDGET_VALUE_PROPERTY_REGISTRY[type]).flat()));
}

/** Short, composable labels (e.g. "<widget label> as Date") for a widget+property combo in a flattened options list. `default` has no suffix - only non-default properties need to be called out. */
export const VALUE_PROPERTY_LABELS: Record<ValueProperty, string> = {
  [ValueProperty.DEFAULT]: "Default",
  [ValueProperty.DATE]: "Date",
  [ValueProperty.TIME]: "Time",
};
