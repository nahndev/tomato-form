import type {
  GridLayout,
  Session,
  Widget,
  WidgetProperties,
} from "@/types/template";
import * as Y from "yjs";

export interface TemplateState {
  name: string;
  widgets: Record<string, Widget>;
  properties: Record<string, WidgetProperties>;
  sessions: Record<string, Session>;
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
  ySessions.set(DEFAULT_SESSION_ID, {
    id: DEFAULT_SESSION_ID,
    name: DEFAULT_SESSION_NAME,
  });
  return DEFAULT_SESSION_ID;
}

// Generic fallback for a missing layout entry - intentionally NOT full
// width (GRID_COLUMNS) since most widgets are half-width by default.
export const DEFAULT_LAYOUT: GridLayout = { column: 0, span: 2, idx: "a" };
