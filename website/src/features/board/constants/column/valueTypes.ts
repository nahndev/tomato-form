import { DisplayType } from "@/types/display-type";
import { ConstType } from "@/types/utils";
import { WidgetType } from "@/types/widget";

export const ValueType = {
  DEFAULT: "default",
  DATE: "date",
  TIME: "time",
} as const;
export type ValueType = ConstType<typeof ValueType>;

/**
 * Which value-types a widget type exposes (a "property of the value", not of the
 * widget's own settings - see docs/v1.0.0/add-column-cell-property.md), and which
 * DisplayType(s) each one may render as on a board column. Only `datetime` has more
 * than one value type.
 */
export const WIDGET_VALUE_TYPE_REGISTRY: Record<WidgetType, Partial<Record<ValueType, DisplayType[]>>> = {
  [WidgetType.TEXT]: { [ValueType.DEFAULT]: [DisplayType.TEXT] },
  [WidgetType.TEXT_AREA]: { [ValueType.DEFAULT]: [DisplayType.TEXT] },
  [WidgetType.NUMBER]: { [ValueType.DEFAULT]: [DisplayType.NUMBER] },
  [WidgetType.DATE]: { [ValueType.DEFAULT]: [DisplayType.DATE, DisplayType.TEXT] },
  [WidgetType.DATETIME]: {
    [ValueType.DEFAULT]: [DisplayType.DATETIME, DisplayType.TEXT, DisplayType.DATE, DisplayType.TIME],
    [ValueType.DATE]: [DisplayType.DATE, DisplayType.TEXT],
    [ValueType.TIME]: [DisplayType.TIME, DisplayType.TEXT],
  },
  [WidgetType.TIME]: { [ValueType.DEFAULT]: [DisplayType.TIME, DisplayType.TEXT] },
  [WidgetType.SELECT]: { [ValueType.DEFAULT]: [DisplayType.TEXT] },
  [WidgetType.CHECKBOX]: { [ValueType.DEFAULT]: [DisplayType.TEXT] },
  [WidgetType.RADIO]: { [ValueType.DEFAULT]: [DisplayType.TEXT] },
  [WidgetType.LABEL]: {},
  [WidgetType.SIGNATURE]: { [ValueType.DEFAULT]: [DisplayType.TEXT] },
  [WidgetType.BUTTON]: {},
  [WidgetType.IMAGE_UPLOADER]: { [ValueType.DEFAULT]: [DisplayType.TEXT] },
  [WidgetType.FILE_UPLOADER]: { [ValueType.DEFAULT]: [DisplayType.TEXT] },
  [WidgetType.BREAK]: {},
  [WidgetType.SESSION]: {},
  [WidgetType.USERS]: { [ValueType.DEFAULT]: [DisplayType.TEXT] },
  [WidgetType.CREATED_AT]: { [ValueType.DEFAULT]: [DisplayType.DATE, DisplayType.TEXT] },
  [WidgetType.TEMPLATE]: {},
  [WidgetType.SUBMITTED_BY]: { [ValueType.DEFAULT]: [DisplayType.TEXT] },
  [WidgetType.BOARD]: {},
};

/** Every value type a widget type exposes, in registry order (`default` always first). */
export function getWidgetValueTypes(type: WidgetType): ValueType[] {
  return Object.keys(WIDGET_VALUE_TYPE_REGISTRY[type]) as ValueType[];
}

/** Which DisplayTypes a given (widgetType, valueType) pair may render as; empty if the value type doesn't exist on that widget. */
export function getValueTypeDisplayTypes(type: WidgetType, valueType: ValueType): DisplayType[] {
  return WIDGET_VALUE_TYPE_REGISTRY[type][valueType] ?? [];
}

/** The dedup'd union of DisplayTypes across every value type a widget type exposes - "can this widget go in a column at all". */
export function getWidgetDisplayTypes(type: WidgetType): DisplayType[] {
  return Array.from(new Set(Object.values(WIDGET_VALUE_TYPE_REGISTRY[type]).flat()));
}

/** Short, composable labels (e.g. "<widget label> as Date") for a widget+valueType combo in a flattened options list. `default` has no suffix - only non-default value types need to be called out. */
export const VALUE_TYPE_LABELS: Record<ValueType, string> = {
  [ValueType.DEFAULT]: "Default",
  [ValueType.DATE]: "Date",
  [ValueType.TIME]: "Time",
};
