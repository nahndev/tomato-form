"use client";

import {
  type GridLayout,
  type Session,
  type SessionLayout,
  type Template,
  type Widget,
  type WidgetProperties,
} from "@/types/template";
import { useCallback, useEffect, useRef, useState } from "react";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import { GRID_COLUMNS } from "../libs/grid-layout/constants";

function clampLayout(column: number, span: number): { column: number; span: number } {
  const clampedColumn = Math.max(0, Math.min(column, GRID_COLUMNS - 1));
  const clampedSpan = Math.max(1, Math.min(span, GRID_COLUMNS - clampedColumn));
  return { column: clampedColumn, span: clampedSpan };
}

const YJS_SERVER_URL = process.env.NEXT_PUBLIC_YJS_URL ?? "ws://localhost:3028";

const DEFAULT_SESSION_ID = "default-session";
const DEFAULT_SESSION_NAME = "Section 1";
const DEFAULT_LAYOUT: GridLayout = { column: 0, span: GRID_COLUMNS, idx: "a" };

type YSessionLayout = Y.Map<unknown>;

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

function getOrCreateSessionLayout(doc: Y.Doc, sessionId: string): YSessionLayout {
  const yLayout = doc.getMap<YSessionLayout>("layout");
  const existing = yLayout.get(sessionId);
  if (existing) return existing;
  const sessionLayout: YSessionLayout = new Y.Map();
  sessionLayout.set("layouts", new Y.Map<GridLayout>());
  yLayout.set(sessionId, sessionLayout);
  return sessionLayout;
}

function getLayoutsMap(sessionLayout: YSessionLayout): Y.Map<GridLayout> {
  return sessionLayout.get("layouts") as Y.Map<GridLayout>;
}

// A widget's session is implied by which session's nested layouts map
// contains its id, since the flat widgetId → sessionId map was folded in.
function findWidgetSessionId(doc: Y.Doc, widgetId: string): string | undefined {
  const yLayout = doc.getMap<YSessionLayout>("layout");
  for (const [sessionId, sessionLayout] of yLayout.entries()) {
    if (getLayoutsMap(sessionLayout).has(widgetId)) return sessionId;
  }
  return undefined;
}

export interface TemplateYjsState {
  name: string;
  widgets: Record<string, Widget>;
  properties: Record<string, WidgetProperties>;
  sessions: Record<string, Session>;
  layout: Record<string, SessionLayout>;
}

export interface UseTemplateYjsReturn {
  state: TemplateYjsState;
  isConnected: boolean;
  setName: (name: string) => void;
  addWidget: (widget: Widget, layout: GridLayout, props: WidgetProperties) => void;
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
  reorderWidgets: (orderedIds: string[]) => void;
}

export function useTemplateYjs(
  templateId: string,
  initialData?: Template,
): UseTemplateYjsReturn {
  const docRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [state, setState] = useState<TemplateYjsState>({
    name: initialData?.name ?? "",
    widgets: initialData?.widgets ?? {},
    properties: initialData?.properties ?? {},
    sessions: initialData?.sessions ?? {},
    layout: initialData?.layout ?? {},
  });

  const getDoc = () => docRef.current!;

  const readState = (doc: Y.Doc): TemplateYjsState => ({
    name: doc.getText("name").toString(),
    widgets: Object.fromEntries(doc.getMap<Widget>("widgets").entries()),
    properties: Object.fromEntries(
      doc.getMap<WidgetProperties>("properties").entries(),
    ),
    sessions: Object.fromEntries(doc.getMap<Session>("sessions").entries()),
    layout: Object.fromEntries(
      Array.from(doc.getMap<YSessionLayout>("layout").entries()).map(
        ([sessionId, sessionLayout]) => [
          sessionId,
          {
            layouts: Object.fromEntries(getLayoutsMap(sessionLayout).entries()),
          },
        ],
      ),
    ),
  });

  useEffect(() => {
    const doc = new Y.Doc();
    docRef.current = doc;

    const provider = new WebsocketProvider(
      YJS_SERVER_URL,
      `template-${templateId}`,
      doc,
    );
    providerRef.current = provider;

    provider.on("status", ({ status }: { status: string }) => {
      setIsConnected(status === "connected");
    });

    provider.on("sync", (isSynced) => {
      if (!isSynced) return;
      doc.transact(() => {
        const sessionId = getOrCreateDefaultSessionId(doc);
        const defaultLayouts = getLayoutsMap(
          getOrCreateSessionLayout(doc, sessionId),
        );
        doc.getMap<Widget>("widgets").forEach((_, widgetId) => {
          if (findWidgetSessionId(doc, widgetId)) return;
          defaultLayouts.set(widgetId, DEFAULT_LAYOUT);
        });
      });
    });

    const onDocUpdate = () => setState(readState(doc));
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
    (widget: Widget, layout: GridLayout, props: WidgetProperties) => {
      const doc = getDoc();
      const { column, span } = clampLayout(layout.column, layout.span);
      doc.transact(() => {
        const sessionId = getOrCreateDefaultSessionId(doc);
        const sessionLayout = getOrCreateSessionLayout(doc, sessionId);
        doc.getMap<Widget>("widgets").set(widget.id, widget);
        getLayoutsMap(sessionLayout).set(widget.id, { ...layout, column, span });
        doc.getMap<WidgetProperties>("properties").set(widget.id, props);
      });
    },
    [],
  );

  const addSession = useCallback((session: Session) => {
    const doc = getDoc();
    doc.transact(() => {
      doc.getMap<Session>("sessions").set(session.id, session);
      getOrCreateSessionLayout(doc, session.id);
    });
  }, []);

  const removeWidget = useCallback((widgetId: string) => {
    const doc = getDoc();
    doc.transact(() => {
      doc.getMap("widgets").delete(widgetId);
      doc.getMap("properties").delete(widgetId);
      const sessionId = findWidgetSessionId(doc, widgetId);
      if (sessionId) {
        getLayoutsMap(getOrCreateSessionLayout(doc, sessionId)).delete(widgetId);
      }
    });
  }, []);

  const updateLayout = useCallback(
    (widgetId: string, sessionId: string, patch: Partial<GridLayout>) => {
      const doc = getDoc();
      const currentSessionId = findWidgetSessionId(doc, widgetId);
      const currentLayouts = currentSessionId
        ? getLayoutsMap(getOrCreateSessionLayout(doc, currentSessionId))
        : undefined;
      const current = currentLayouts?.get(widgetId) ?? DEFAULT_LAYOUT;
      const merged = { ...current, ...patch };
      const { column, span } = clampLayout(merged.column, merged.span);
      const targetLayouts = getLayoutsMap(getOrCreateSessionLayout(doc, sessionId));
      doc.transact(() => {
        if (currentSessionId && currentSessionId !== sessionId) {
          currentLayouts?.delete(widgetId);
        }
        targetLayouts.set(widgetId, { ...merged, column, span });
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

  const reorderWidgets = useCallback((orderedIds: string[]) => {
    const doc = getDoc();
    doc.transact(() => {
      orderedIds.forEach((id) => {
        const sessionId =
          findWidgetSessionId(doc, id) ?? getOrCreateDefaultSessionId(doc);
        const yLayouts = getLayoutsMap(getOrCreateSessionLayout(doc, sessionId));
        const current = yLayouts.get(id) ?? DEFAULT_LAYOUT;
        yLayouts.set(id, { ...current, idx: "a" });
      });
    });
  }, []);

  return {
    state,
    isConnected,
    setName,
    addWidget,
    removeWidget,
    addSession,
    updateLayout,
    updateProperties,
    reorderWidgets,
  };
}
