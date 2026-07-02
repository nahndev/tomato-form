"use client";

import { useTemplateDoc } from "@/features/template/components/provider/TemplateDocProvider";
import {
  DEFAULT_LAYOUT,
} from "@/features/template/hooks/internal/templateStateReader";
import type { GridLayout, Session } from "@/types/template";
import { useCallback } from "react";

export interface SessionActions {
  addSession: (session: Session) => void;
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
    (session: Session) => {
      doc.transact(() => {
        doc.getMap<Session>("sessions").set(session.id, session);
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

  return { addSession, updateLayout };
}
