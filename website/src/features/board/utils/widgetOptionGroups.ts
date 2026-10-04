import {
  ValueType,
  getValueTypeDisplayTypes,
  getWidgetValueTypes,
} from "@/features/board/constants/column/valueTypes";
import { formatItemKey } from "@/features/board/utils/itemKey";
import type { DisplayType } from "@/types/display-type";
import type { TemplateSnapshot, Widget } from "@/types/template";

/** Session id for widgets that aren't placed in any session. */
export const UNGROUPED_SESSION = "__ungrouped__";

export interface WidgetOption {
  itemKey: string;
  widget: Widget;
  valueType: ValueType;
}

/** One widget: its first value type (the row itself) and the rest (rows folded under it). */
export interface WidgetOptionEntry {
  primary: WidgetOption;
  variants: WidgetOption[];
}

export interface WidgetOptionGroup {
  sessionId: string;
  sessionName: string | null;
  entries: WidgetOptionEntry[];
}

/**
 * Buckets widgets by session, each widget becoming one entry whose extra value types
 * (e.g. `datetime` → Date / Time) are variants of its first one. Only value types that
 * fit `allowDisplayTypes` are kept; widgets left with none are dropped.
 */
export function groupWidgetOptions(
  widgets: Widget[],
  snapshot: TemplateSnapshot,
  allowDisplayTypes: DisplayType[] | null,
): WidgetOptionGroup[] {
  const bySession = new Map<string, WidgetOptionGroup>();

  widgets.forEach((widget) => {
    const [primary, ...variants] = getWidgetValueTypes(widget.type)
      .filter(
        (valueType) =>
          allowDisplayTypes === null ||
          getValueTypeDisplayTypes(widget.type, valueType).some((type) =>
            allowDisplayTypes.includes(type),
          ),
      )
      .map((valueType) => ({
        itemKey: formatItemKey(widget.id, valueType),
        widget,
        valueType,
      }));
    if (!primary) return;

    const sessionId = snapshot.widgetToSession[widget.id] ?? UNGROUPED_SESSION;
    const group = bySession.get(sessionId) ?? {
      sessionId,
      sessionName: snapshot.sessions[sessionId]?.name ?? null,
      entries: [],
    };
    group.entries.push({ primary, variants });
    bySession.set(sessionId, group);
  });

  return Array.from(bySession.values());
}
