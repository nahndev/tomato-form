"use client";

import type { GridLayout, SessionProperties } from "@/types/template";
import { useHandler, useTransaction } from "@tomato/sync";
import { LayoutHandler, type WidgetPlacement } from "../handlers/LayoutHandler";
import { SessionHandler } from "../handlers/SessionHandler";

export interface SessionActions {
  addSession: (id: string, properties: SessionProperties) => void;
  updateSession: (sessionId: string, patch: Partial<SessionProperties>) => void;
  removeSession: (sessionId: string) => void;
  updateLayout: (
    widgetId: string,
    sessionId: string,
    layout: Partial<GridLayout>,
  ) => void;
  /** Moves and/or resizes a widget (grid fields, session, order) as one undo step. */
  placeWidget: (widgetId: string, placement: WidgetPlacement) => void;
}

/**
 * Action-only, no exposed state - mutates the doc through `SessionHandler`/
 * `LayoutHandler`, never re-renders on data change. No `useCallback` here -
 * the Handlers and `transact` are already stable references.
 */
export function useSessionActions(): SessionActions {
  const sessionHandler = useHandler(SessionHandler);
  const layoutHandler = useHandler(LayoutHandler);
  const transact = useTransaction();

  return {
    addSession: (id, properties) =>
      transact(() => sessionHandler.addSession(id, properties)),

    updateSession: (sessionId, patch) =>
      transact(() => sessionHandler.updateSession(sessionId, patch)),

    removeSession: (sessionId) =>
      transact(() => sessionHandler.removeSession(sessionId)),

    updateLayout: (widgetId, sessionId, patch) =>
      transact(() => layoutHandler.setLayout(widgetId, sessionId, patch)),

    placeWidget: (widgetId, placement) =>
      transact(() => layoutHandler.placeWidget(widgetId, placement)),
  };
}
