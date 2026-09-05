export type BoardColumnDisplayType = "text" | "date" | "number";

export interface BoardColumnItem {
  templateId: string;
  widgetId: string;
}

export type ColumnSize = { width: number } | { flex: number };

export interface BoardColumn {
  id: string;
  type: BoardColumnDisplayType;
  size: ColumnSize;
  label: string | null;
  items: BoardColumnItem[];
}
