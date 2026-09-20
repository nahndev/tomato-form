import type { ValueType } from "@/features/board/constants/column/valueTypes";

/**
 * `widgetId:property` compound key - the addressing scheme `BoardChartViewConfig`'s
 * `groupBy`/`valueField` still use, and that a submission's `dataDisplays` doc is
 * still looked up by. `BoardColumn.items` itself no longer needs this - it stores
 * `{ widgetId, property }` directly, see `JsonColumn`.
 */
export function formatItemKey(widgetId: string, property: ValueType): string {
  return `${widgetId}:${property}`;
}

export function parseItemKey(key: string): { widgetId: string; property: ValueType } {
  const [widgetId, property] = key.split(":");
  return { widgetId, property: property as ValueType };
}
