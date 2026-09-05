import { WIDGET_DISPLAY_TYPE_REGISTRY } from "@/features/template/constants/widget/displayTypes";
import type { ColumnSize } from "@/types/board";
import type { TemplateVersionSnapshot, Widget } from "@/types/template";
import type { CSSProperties } from "react";

/** Maps a column's stored size to the inline style that renders it in a flex row. */
export function getColumnSizeStyle(
  size: ColumnSize | null,
): CSSProperties | undefined {
  if (!size) return undefined;

  if ("flex" in size) return { flex: `${size.flex} 1 0%` };

  return { width: size.width, flexShrink: 0 };
}

export function getDataFieldWidgets(
  snapshot: TemplateVersionSnapshot,
): Widget[] {
  return Object.values(snapshot.widgets).filter(
    (widget) => WIDGET_DISPLAY_TYPE_REGISTRY[widget.type].length > 0,
  );
}

export function getWidgetOptionLabel(
  snapshot: TemplateVersionSnapshot,
  widgetId: string,
): string {
  const widget = snapshot.widgets[widgetId];
  if (!widget) return "Unknown widget";

  const sessionId = snapshot.widgetToSession[widgetId];
  const sessionName = sessionId
    ? snapshot.sessions[sessionId]?.name
    : undefined;

  return sessionName ? `${sessionName}/${widget.label}` : widget.label;
}
