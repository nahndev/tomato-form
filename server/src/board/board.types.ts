export type BoardColumnDisplayType = "text" | "date" | "number";

export interface BoardColumnItem {
  templateId: string;
  widgetId: string;
}

export interface BoardColumn {
  id: string;
  type: BoardColumnDisplayType;
  size: number;
  items: BoardColumnItem[];
}
