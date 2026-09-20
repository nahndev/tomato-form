export type BoardColumnDisplayType = "text" | "date" | "time" | "datetime" | "number";

export type ValueProperty = "default" | "date" | "time";

export type ColumnSize = { width: number } | { flex: number };

export interface BoardColumnItem {
  widgetId: string;
  property: ValueProperty;
}

export interface BoardColumn {
  id: string;
  type: BoardColumnDisplayType;
  size: ColumnSize;
  label: string | null;
  /** Map of templateId to the widget + value-property picked from that template. */
  items: Record<string, BoardColumnItem>;
}
