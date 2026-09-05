export type BoardColumnDisplayType = "text" | "date" | "number";

export type ColumnSize = { width: number } | { flex: number };

export interface BoardColumn {
  id: string;
  type: BoardColumnDisplayType;
  size: ColumnSize;
  label: string | null;
  /** Map of templateId to the widgetId picked from that template. */
  items: Record<string, string>;
}
