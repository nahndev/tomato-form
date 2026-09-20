/**
 * Values must stay in sync with `BoardViewType` in
 * `website/src/types/board-view.ts` — there is no shared-types package
 * between web and server in this monorepo, so this is a hand mirror.
 * Only "chart" is fully configurable today; "calendar"/"dashboard" are
 * reserved placeholders per the ticket's "extend later" scope.
 */
export type BoardViewType = "chart" | "calendar" | "dashboard";

export type ChartAggregation = "count" | "sum" | "avg";

export type ChartKind = "bar" | "line" | "pie";

export interface BoardChartViewConfig {
  /** Per-templateId `widgetId:property` compound key, same addressing scheme as BoardColumn.items. */
  groupBy: Record<string, string>;
  aggregation: ChartAggregation;
  /** Required when aggregation is "sum" or "avg". */
  valueField?: Record<string, string>;
  chartKind: ChartKind;
}

export interface BoardView {
  id: string;
  name: string;
  type: BoardViewType;
  /** Placeholder shape for "calendar"/"dashboard" until those view types are built. */
  config: BoardChartViewConfig | Record<string, never>;
}
