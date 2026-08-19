"use client";

import { useTemplateDoc } from "@/features/template/components/provider/TemplateDocProvider";
import {
  DEFAULT_LAYOUT,
} from "@/features/template/hooks/internal/templateStateReader";
import type { GridLayout, Session, SessionProperties } from "@/types/template";
import { useCallback } from "react";

export interface SessionActions {
  addSession: (id: string, properties: SessionProperties) => void;
  updateSession: (sessionId: string, patch: Partial<SessionProperties>) => void;
  updateLayout: (
    widgetId: string,
    sessionId: string,
    layout: Partial<GridLayout>,
  ) => void;
}

/**
 * Action-only, no exposed state - mutates the doc, never re-renders on data
 * change. Reads current layout values straight off the `layouts` Y.Map at
 * call time (not from React state) so merges always see the latest value.
 */
export function useSessionActions(): SessionActions {
  const doc = useTemplateDoc();

  const addSession = useCallback(
    (id: string, properties: SessionProperties) => {
      doc.transact(() => {
        doc.getMap<Session>("sessions").set(id, { id });
        doc.getMap<SessionProperties>("sessionProperties").set(id, properties);
      });
    },
    [doc],
  );

  const updateSession = useCallback(
    (sessionId: string, patch: Partial<SessionProperties>) => {
      if (!doc.getMap<Session>("sessions").has(sessionId)) return;
      const sessionProperties = doc.getMap<SessionProperties>("sessionProperties");
      const current = sessionProperties.get(sessionId) ?? { name: "" };
      doc.transact(() => {
        sessionProperties.set(sessionId, { ...current, ...patch });
      });
    },
    [doc],
  );

  const updateLayout = useCallback(
    (widgetId: string, sessionId: string, patch: Partial<GridLayout>) => {
      const layouts = doc.getMap<GridLayout>("layouts");
      const current = layouts.get(widgetId) ?? DEFAULT_LAYOUT;
      doc.transact(() => {
        layouts.set(widgetId, { ...current, ...patch });
        doc.getMap<string>("widgetToSession").set(widgetId, sessionId);
      });
    },
    [doc],
  );

  return { addSession, updateSession, updateLayout };
}
