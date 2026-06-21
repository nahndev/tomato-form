"use client";

import { useTemplateDocContext } from "@/features/template/components/provider/TemplateProvider";
import type { Widget, WidgetProperties } from "@/types/template";
import { createContext, useContext, useMemo } from "react";

export interface WidgetContextValue {
  widget: Widget;
  properties: WidgetProperties;
}

const WidgetContext = createContext<WidgetContextValue | null>(null);

export interface WidgetProviderProps {
  widget: Widget;
  children: React.ReactNode;
}

export const WidgetProvider: React.FC<WidgetProviderProps> = ({
  widget,
  children,
}) => {
  const { state } = useTemplateDocContext();
  const properties = useMemo(
    () => state.properties[widget.id],
    [state.properties, widget.id],
  );

  return (
    <WidgetContext.Provider value={{ widget, properties }}>
      {children}
    </WidgetContext.Provider>
  );
};

export function useWidgetContext(): WidgetContextValue {
  const ctx = useContext(WidgetContext);
  if (!ctx) {
    throw new Error("useWidget must be used inside WidgetProvider");
  }
  return ctx;
}
