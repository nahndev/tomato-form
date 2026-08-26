"use client";

import type { GridLayout, SessionProperties } from "@/types/template";
import { useHandler, useTransaction } from "@tomato/sync";
import { LayoutHandler } from "../handlers/LayoutHandler";
import { SessionHandler } from "../handlers/SessionHandler";

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

    updateLayout: (widgetId, sessionId, patch) =>
      transact(() => layoutHandler.setLayout(widgetId, sessionId, patch)),
  };
}
