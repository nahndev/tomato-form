import { WIDGET_DISPLAY_TYPE_REGISTRY } from "@/features/template/components/widget/display-type.registry";
import type { TemplateVersionSnapshot, Widget } from "@/types/template";

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
  const sessionName = sessionId ? snapshot.sessions[sessionId]?.name : undefined;

  return sessionName ? `${sessionName}/${widget.label}` : widget.label;
}
