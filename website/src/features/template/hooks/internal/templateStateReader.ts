import { LayoutIdx } from "@/components/ui/grid";
import { WIDGET_REGISTRY } from "@/features/template/components/widget/registry";
import type {
  GridLayout,
  Session,
  SessionProperties,
  Widget,
  WidgetProperties,
} from "@/types/template";
import { WidgetType } from "@/types/widget";
import * as Y from "yjs";

export interface TemplateState {
  name: string;
  widgets: Record<string, Widget>;
  properties: Record<string, WidgetProperties>;
  sessions: Record<string, Session>;
  sessionProperties: Record<string, SessionProperties>;
  layouts: Record<string, GridLayout>;
  widgetToSession: Record<string, string>;
}

export function readTemplateState(doc: Y.Doc): TemplateState {
  return {
    name: doc.getText("name").toString(),
    widgets: Object.fromEntries(doc.getMap<Widget>("widgets").entries()),
    properties: Object.fromEntries(
      doc.getMap<WidgetProperties>("properties").entries(),
    ),
    sessions: Object.fromEntries(doc.getMap<Session>("sessions").entries()),
    sessionProperties: Object.fromEntries(
      doc.getMap<SessionProperties>("sessionProperties").entries(),
    ),
    layouts: Object.fromEntries(doc.getMap<GridLayout>("layouts").entries()),
    widgetToSession: Object.fromEntries(
      doc.getMap<string>("widgetToSession").entries(),
    ),
  };
}

// Fixed id so concurrent clients that both find no session converge on the
// same Y.Map key instead of creating two competing default sessions.
const DEFAULT_SESSION_ID = "default-session";
const DEFAULT_SESSION_NAME = "Section 1";

export function getOrCreateDefaultSessionId(doc: Y.Doc): string {
  const ySessions = doc.getMap<Session>("sessions");
  const existing = ySessions.values().next().value as Session | undefined;
  if (existing) return existing.id;
  ySessions.set(DEFAULT_SESSION_ID, { id: DEFAULT_SESSION_ID });
  doc
    .getMap<SessionProperties>("sessionProperties")
    .set(DEFAULT_SESSION_ID, { name: DEFAULT_SESSION_NAME });
  return DEFAULT_SESSION_ID;
}

// Generic fallback for a missing layout entry - intentionally NOT full
// width (GRID_COLUMNS) since most widgets are half-width by default.
export const DEFAULT_LAYOUT: GridLayout = { column: 0, span: 2, idx: "a" };

// Fixed ids so concurrent clients that both find a brand-new template
// converge on the same default system widgets instead of creating
// duplicates (mirrors DEFAULT_SESSION_ID above).
const DEFAULT_SYSTEM_WIDGET_TYPES: WidgetType[] = [
  WidgetType.CREATED_AT,
  WidgetType.TEMPLATE,
  WidgetType.SUBMITTED_BY,
];

/**
 * Seeds the read-only system widgets (Created At, Template, By) into a
 * brand-new template's doc, so board columns have sensible defaults out of
 * the box. No-ops once the doc already has any widgets, so it never touches
 * a template a user has started building or intentionally emptied out.
 *
 * Deliberately left out of `widgetToSession` - these are board-only
 * metadata columns, not part of the fill-form session flow, so they must
 * not show up inside any session's grid.
 */
export function getOrCreateDefaultSystemWidgets(doc: Y.Doc): void {
  const yWidgets = doc.getMap<Widget>("widgets");
  if (yWidgets.size > 0) return;

  const layouts = doc.getMap<GridLayout>("layouts");
  const properties = doc.getMap<WidgetProperties>("properties");

  doc.transact(() => {
    for (const type of DEFAULT_SYSTEM_WIDGET_TYPES) {
      const def = WIDGET_REGISTRY[type];
      const id = `system-${type}`;
      yWidgets.set(id, { id, type });
      layouts.set(id, {
        ...def.defaultLayout,
        idx: LayoutIdx.getInsertIdx(Object.fromEntries(layouts.entries()), null),
      });
      properties.set(id, def.defaultSettings);
    }
  });
}
