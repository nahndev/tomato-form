export type BoardColumnDisplayType = "text" | "date" | "time" | "datetime" | "number";

export type ValueProperty = "default" | "date" | "time";

export type ColumnSize = { width: number } | { flex: number };

export interface BoardColumn {
  id: string;
  type: BoardColumnDisplayType;
  size: ColumnSize;
  label: string | null;
  /** Map of templateId to a `widgetId:property` compound key - the widget + value-property picked from that template. widgetId and property never change independently, so they're one immutable key rather than an object. */
  items: Record<string, string>;
}
