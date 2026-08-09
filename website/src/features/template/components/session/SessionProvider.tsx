"use client";

import { createContext, useContext } from "react";

const SessionIdContext = createContext<string | null>(null);

export interface SessionProviderProps {
  sessionId: string;
  children: React.ReactNode;
}

/** Passes down which session its subtree belongs to - no yjs/doc dependency. */
export const SessionProvider: React.FC<SessionProviderProps> = ({
  sessionId,
  children,
}) => (
  <SessionIdContext.Provider value={sessionId}>
    {children}
  </SessionIdContext.Provider>
);

export function useSessionId(): string {
  const id = useContext(SessionIdContext);
  if (!id) {
    throw new Error("This hook must be used inside <SessionProvider>");
  }
  return id;
}
