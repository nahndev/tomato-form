"use client";

import { WIDGET_REGISTRY } from "@/features/template/components/widget/registry";
import { LayoutIdx } from "@/features/template/libs/grid-layout/utils";
import {
  Widget,
  type GridLayout,
  type Session,
  type Template,
  type WidgetProperties,
} from "@/types/template";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useCallback, useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { GRID_COLUMNS } from "../libs/grid-layout/constants";

function clampLayout(
  column: number,
  span: number,
): { column: number; span: number } {
  const clampedColumn = Math.max(0, Math.min(column, GRID_COLUMNS - 1));
  const clampedSpan = Math.max(1, Math.min(span, GRID_COLUMNS - clampedColumn));
  return { column: clampedColumn, span: clampedSpan };
}

const YJS_SERVER_URL = process.env.NEXT_PUBLIC_YJS_URL ?? "ws://localhost:3028";

const DEFAULT_SESSION_ID = "default-session";
const DEFAULT_SESSION_NAME = "Section 1";
// Generic fallback for a missing layout entry - intentionally NOT full
// width (GRID_COLUMNS) since most widgets are half-width by default.
const DEFAULT_LAYOUT: GridLayout = { column: 0, span: 2, idx: "a" };

// Fixed id so concurrent clients that both find no session converge on the
// same Y.Map key instead of creating two competing default sessions.
function getOrCreateDefaultSessionId(doc: Y.Doc): string {
  const ySessions = doc.getMap<Session>("sessions");
  const existing = ySessions.values().next().value as Session | undefined;
  if (existing) return existing.id;
  ySessions.set(DEFAULT_SESSION_ID, {
    id: DEFAULT_SESSION_ID,
    name: DEFAULT_SESSION_NAME,
  });
  return DEFAULT_SESSION_ID;
}

export interface TemplateYjsState {
  name: string;
  widgets: Record<string, Widget>;
  properties: Record<string, WidgetProperties>;
  sessions: Record<string, Session>;
  layouts: Record<string, GridLayout>;
  widgetToSession: Record<string, string>;
}

export interface UseTemplateYjsReturn {
  state: TemplateYjsState;
  isConnected: boolean;
  setName: (name: string) => void;
  addWidget: (
    id: Widget["id"],
    type: Widget["type"],
    before: Widget | null,
  ) => void;
  removeWidget: (widgetId: string) => void;
  addSession: (session: Session) => void;
  updateLayout: (
    widgetId: string,
    sessionId: string,
    layout: Partial<GridLayout>,
  ) => void;
  updateProperties: (
    widgetId: string,
    props: Partial<WidgetProperties>,
  ) => void;
}

export class StateReader {
  static readState(doc: Y.Doc): TemplateYjsState {
    return {
      name: StateReader.readName(doc),
      widgets: StateReader.readWidgets(doc),
      properties: StateReader.readProperties(doc),
      sessions: StateReader.readSessions(doc),
      layouts: StateReader.readLayouts(doc),
      widgetToSession: StateReader.readWidgetToSession(doc),
    };
  }

  static readName(doc: Y.Doc): TemplateYjsState["name"] {
    return doc.getText("name").toString();
  }

  static readWidgets(doc: Y.Doc): TemplateYjsState["widgets"] {
    return Object.fromEntries(doc.getMap<Widget>("widgets").entries());
  }

  static readProperties(doc: Y.Doc): TemplateYjsState["properties"] {
    return Object.fromEntries(
      doc.getMap<WidgetProperties>("properties").entries(),
    );
  }

  static readSessions(doc: Y.Doc): TemplateYjsState["sessions"] {
    return Object.fromEntries(doc.getMap<Session>("sessions").entries());
  }

  static readLayouts(doc: Y.Doc): TemplateYjsState["layouts"] {
    return Object.fromEntries(doc.getMap<GridLayout>("layouts").entries());
  }

  static readWidgetToSession(doc: Y.Doc): TemplateYjsState["widgetToSession"] {
    return Object.fromEntries(doc.getMap<string>("widgetToSession").entries());
  }
}

export function useTemplateYjs(
  templateId: string,
  initialData?: Template,
): UseTemplateYjsReturn {
  const docRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<HocuspocusProvider | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [state, setState] = useState<TemplateYjsState>({
    name: initialData?.name ?? "",
    widgets: initialData?.widgets ?? {},
    properties: initialData?.properties ?? {},
    sessions: initialData?.sessions ?? {},
    layouts: initialData?.layouts ?? {},
    widgetToSession: initialData?.widgetToSession ?? {},
  });

  const getDoc = () => docRef.current!;
  useEffect(() => {
    const doc = new Y.Doc();
    docRef.current = doc;

    const provider = new HocuspocusProvider({
      url: YJS_SERVER_URL,
      name: `template-${templateId}`,
      document: doc,
    });
    providerRef.current = provider;

    provider.on("status", ({ status }: { status: string }) => {
      setIsConnected(status === "connected");
    });

    const onDocUpdate = () => setState(StateReader.readState(doc));
    doc.on("update", onDocUpdate);

    return () => {
      doc.off("update", onDocUpdate);
      provider.destroy();
      doc.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  const setName = useCallback((name: string) => {
    const doc = getDoc();
    const yName = doc.getText("name");
    doc.transact(() => {
      yName.delete(0, yName.length);
      yName.insert(0, name);
    });
  }, []);

  const addWidget = useCallback(
    (id: Widget["id"], type: Widget["type"], before: Widget | null) => {
      const doc = getDoc();
      const def = WIDGET_REGISTRY[type];
      const props = def.defaultSettings;
      const layout = {
        ...def.defaultLayout,
        idx: LayoutIdx.getInsertIdx(StateReader.readLayouts(doc), before),
      };
      const beforeSessionId =
        before && StateReader.readWidgetToSession(doc)[before.id];

      doc.transact(() => {
        const sessionId = beforeSessionId ?? getOrCreateDefaultSessionId(doc);
        doc.getMap<Widget>("widgets").set(id, { id, type });
        doc.getMap<GridLayout>("layouts").set(id, layout);
        doc.getMap<WidgetProperties>("properties").set(id, props);
        doc.getMap<string>("widgetToSession").set(id, sessionId);
      });
    },
    [],
  );

  const addSession = useCallback((session: Session) => {
    const doc = getDoc();
    doc.transact(() => {
      doc.getMap<Session>("sessions").set(session.id, session);
    });
  }, []);

  const removeWidget = useCallback((widgetId: string) => {
    const doc = getDoc();
    doc.transact(() => {
      doc.getMap("widgets").delete(widgetId);
      doc.getMap("properties").delete(widgetId);
      doc.getMap("layouts").delete(widgetId);
      doc.getMap("widgetToSession").delete(widgetId);
    });
  }, []);

  const updateLayout = useCallback(
    (widgetId: string, sessionId: string, patch: Partial<GridLayout>) => {
      const doc = getDoc();
      const layouts = doc.getMap<GridLayout>("layouts");
      const current = layouts.get(widgetId) ?? DEFAULT_LAYOUT;
      doc.transact(() => {
        layouts.set(widgetId, { ...current, ...patch });
        doc.getMap<string>("widgetToSession").set(widgetId, sessionId);
      });
    },
    [],
  );

  const updateProperties = useCallback(
    (widgetId: string, patch: Partial<WidgetProperties>) => {
      const yProps = getDoc().getMap<WidgetProperties>("properties");
      const current = yProps.get(widgetId) ?? { label: "" };
      yProps.set(widgetId, { ...current, ...patch });
    },
    [],
  );

  return {
    state,
    isConnected,
    setName,
    addWidget,
    removeWidget,
    addSession,
    updateLayout,
    updateProperties,
  };
}
