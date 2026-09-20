import { ConstType } from "@/types/utils";

export const BoardViewType = {
  CHART: "chart",
  CALENDAR: "calendar",
  DASHBOARD: "dashboard",
} as const;
export type BoardViewType = ConstType<typeof BoardViewType>;

export const ChartAggregation = {
  COUNT: "count",
  SUM: "sum",
  AVG: "avg",
} as const;
export type ChartAggregation = ConstType<typeof ChartAggregation>;

export const ChartKind = {
  BAR: "bar",
  LINE: "line",
  PIE: "pie",
} as const;
export type ChartKind = ConstType<typeof ChartKind>;

export interface BoardChartViewConfig {
  /** Map of templateId to a `widgetId:property` compound key to group submissions by. */
  groupBy: Record<string, string>;
  aggregation: ChartAggregation;
  /** Map of templateId to a `widgetId:property` compound key. Required when aggregation is "sum" or "avg". */
  valueField?: Record<string, string>;
  chartKind: ChartKind;
}

/** Grows into a union once Calendar/Dashboard view types get their own config shape. */
export type BoardViewConfig = BoardChartViewConfig;

export interface BoardView {
  id: string;
  name: string;
  type: BoardViewType;
  config: BoardViewConfig;
}

/** Shape of a view while it's being edited in a settings popup, before it's ready to save. */
export type BoardViewDraft = Partial<Omit<BoardView, "config">> & {
  config?: Partial<BoardChartViewConfig>;
};
