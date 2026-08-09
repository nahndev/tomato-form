"use client";

import { createContext, useContext } from "react";

const WidgetIdContext = createContext<string | null>(null);

export interface WidgetProviderProps {
  widgetId: string;
  children: React.ReactNode;
}

/** Passes down which widget its subtree belongs to - no yjs/doc dependency. */
export const WidgetProvider: React.FC<WidgetProviderProps> = ({
  widgetId,
  children,
}) => (
  <WidgetIdContext.Provider value={widgetId}>
    {children}
  </WidgetIdContext.Provider>
);

export function useWidgetId(): string {
  const id = useContext(WidgetIdContext);
  if (!id) {
    throw new Error("This hook must be used inside <WidgetProvider>");
  }
  return id;
}
