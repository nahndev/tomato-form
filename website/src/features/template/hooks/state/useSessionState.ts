"use client";

import { useSessionId } from "@/features/template/components/provider/SessionProvider";
import { useTemplateState } from "@/features/template/hooks/state/useTemplateState";
import type { GridLayout, Session, Widget } from "@/types/template";
import { useMemo } from "react";
import { pickBy } from "remeda";

export interface SessionState {
  session: Session | undefined;
  widgets: Record<string, Widget>;
  layouts: Record<string, GridLayout>;
}

/**
 * State-only, doc-independent: derives purely from `useTemplateState()`.
 * Reads the session id from the nearest `<SessionProvider>`.
 */
export function useSessionState(): SessionState {
  const id = useSessionId();
  const { sessions, widgets, layouts, widgetToSession } = useTemplateState();

  const sessionLayouts = useMemo(
    () => pickBy(layouts, (_, widgetId) => widgetToSession[widgetId] === id),
    [layouts, widgetToSession, id],
  );

  const sessionWidgets = useMemo(
    () => pickBy(widgets, (_, widgetId) => widgetId in sessionLayouts),
    [widgets, sessionLayouts],
  );

  return { session: sessions[id], widgets: sessionWidgets, layouts: sessionLayouts };
}
