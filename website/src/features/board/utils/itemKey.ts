import type { ValueProperty } from "@/features/board/constants/column/valueProperties";

/**
 * `widgetId:property` compound key - the addressing scheme `BoardChartViewConfig`'s
 * `groupBy`/`valueField` still use, and that a submission's `dataDisplays` doc is
 * still looked up by. `BoardColumn.items` itself no longer needs this - it stores
 * `{ widgetId, property }` directly, see `JsonColumn`.
 */
export function formatItemKey(widgetId: string, property: ValueProperty): string {
  return `${widgetId}:${property}`;
}

export function parseItemKey(key: string): { widgetId: string; property: ValueProperty } {
  const [widgetId, property] = key.split(":");
  return { widgetId, property: property as ValueProperty };
}
