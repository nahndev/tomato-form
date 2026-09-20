import {
  getPropertyDisplayTypes,
  type ValueProperty,
} from "@/features/board/constants/column/valueProperties";
import type { DisplayType } from "@/types/display-type";
import type { WidgetType } from "@/types/widget";

export interface DisplayTypeEntry {
  widgetType: WidgetType;
  property: ValueProperty;
}

/**
 * DisplayTypes shared by every (widgetType, property) entry in the list. No
 * entries means no constraint yet, so callers should treat `null` as
 * unrestricted; entries that share nothing return an empty array (matches
 * nothing further).
 */
export function getCommonDisplayTypes(entries: DisplayTypeEntry[]): DisplayType[] | null {
  if (entries.length === 0) return null;

  return entries
    .map(({ widgetType, property }) => getPropertyDisplayTypes(widgetType, property))
    .reduce((common, types) => common.filter((type) => types.includes(type)));
}
