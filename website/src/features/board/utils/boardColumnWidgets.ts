import {
  getWidgetDisplayTypes,
  type ValueProperty,
} from "@/features/board/constants/column/valueProperties";
import { JsonColumn } from "@/features/board/utils/column";
import type { BoardColumnDraft, ColumnSize } from "@/types/board";
import type { Template, TemplateSnapshot, Widget } from "@/types/template";
import type { CSSProperties } from "react";

/** Maps a column's stored size to the inline style that renders it in a flex row. */
export function getColumnSizeStyle(
  size: ColumnSize | null,
): CSSProperties | undefined {
  if (!size) return undefined;

  if ("flex" in size) return { flex: `${size.flex} 1 0%` };

  return { width: size.width, flexShrink: 0 };
}

export function getDataFieldWidgets(snapshot: TemplateSnapshot): Widget[] {
  return Object.values(snapshot.widgets).filter(
    (widget) => getWidgetDisplayTypes(widget.type).length > 0,
  );
}

export interface SelectedColumnItem {
  templateId: string;
  widget: Widget;
  property: ValueProperty;
}

/** Resolves each column item to its widget definition, dropping items whose template/widget no longer exists. */
export function getSelectedColumnItems(
  column: BoardColumnDraft,
  templates: Template[],
): SelectedColumnItem[] {
  return Object.entries(JsonColumn.getItems(column)).flatMap(
    ([templateId, itemKey]) => {
      const { widgetId, property } = JsonColumn.parseItemKey(itemKey);
      const template = templates.find((t) => t.id === templateId);
      const widget = template?.snapshot.widgets[widgetId];
      return widget ? [{ templateId, widget, property }] : [];
    },
  );
}

export function getWidgetOptionLabel(snapshot: TemplateSnapshot, widgetId: string): string {
  const widget = snapshot.widgets[widgetId];
  if (!widget) return "Unknown widget";

  const sessionId = snapshot.widgetToSession[widgetId];
  const sessionName = sessionId
    ? snapshot.sessions[sessionId]?.name
    : undefined;

  return sessionName ? `${sessionName}/${widget.label}` : widget.label;
}
