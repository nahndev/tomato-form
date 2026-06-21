"use client";

import { useTemplateContext } from "@/features/template/components/provider/TemplateProvider";
import type { GridLayout, Session, Widget } from "@/types/template";
import { createContext, useContext, useMemo } from "react";
import { pickBy } from "remeda";

export interface SessionContextValue {
  session: Session;
  layouts: Record<string, GridLayout>;
  widgets: Record<string, Widget>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export interface SessionProviderProps {
  session: Session;
  children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({
  session,
  children,
}) => {
  const { state } = useTemplateContext();

  const layouts = useMemo(
    () => state.layout[session.id]?.layouts ?? {},
    [state.layout, session.id],
  );

  const widgets = useMemo(
    () => pickBy(state.widgets, (_, widgetId) => widgetId in layouts),
    [state.widgets, layouts],
  );

  const value = useMemo<SessionContextValue>(
    () => ({ session, layouts, widgets }),
    [session, layouts, widgets],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export function useSessionContext(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used inside SessionProvider");
  }
  return ctx;
}
