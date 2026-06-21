"use client";

import { useTemplateContext } from "@/features/template/components/provider/TemplateProvider";
import type { GridLayout, Session, Widget } from "@/types/template";
import { createContext, useCallback, useContext, useMemo } from "react";
import { pickBy } from "remeda";

export interface SessionContextValue {
  session: Session;
  layouts: Record<string, GridLayout>;
  widgets: Record<string, Widget>;
  onMoving: (id: string, column: number, idx: string) => void;
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
  const { state, updateLayout } = useTemplateContext();

  const layouts = useMemo(
    () => state.layout[session.id]?.layouts ?? {},
    [state.layout, session.id],
  );

  const widgets = useMemo(
    () => pickBy(state.widgets, (_, widgetId) => widgetId in layouts),
    [state.widgets, layouts],
  );

  const onMoving = useCallback(
    (id: string, column: number, idx: string) => {
      updateLayout(id, session.id, { column, idx });
    },
    [updateLayout, session.id],
  );

  const value = useMemo<SessionContextValue>(
    () => ({ session, layouts, widgets, onMoving }),
    [session, layouts, widgets, onMoving],
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
