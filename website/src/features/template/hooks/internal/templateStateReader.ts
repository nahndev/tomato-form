import type {
  GridLayout,
  Session,
  SessionProperties,
  Widget,
  WidgetProperties,
} from "@/types/template";
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

// Generic fallback for a missing layout entry - intentionally NOT full
// width (GRID_COLUMNS) since most widgets are half-width by default.
export const DEFAULT_LAYOUT: GridLayout = { column: 0, span: 2, idx: "a" };
