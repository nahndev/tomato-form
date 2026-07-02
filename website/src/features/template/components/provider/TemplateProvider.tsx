"use client";

import { TemplateDocProvider } from "@/features/template/components/provider/TemplateDocProvider";
import { useSelection } from "@/features/template/hooks/useSelection";
import {
  TemplateMetaContext,
  useTemplateMeta,
} from "@/features/template/hooks/internal/templateMeta";
import { useTemplateState } from "@/features/template/hooks/state/useTemplateState";
import type { Template, TemplateMode, Widget } from "@/types/template";
import { createContext, useContext } from "react";
import { values } from "remeda";

export interface TemplateProviderProps {
  mode: TemplateMode;
  template: Template;
  children: React.ReactNode;
}

/**
 * Public composition root for the template feature: wires up the yjs doc
 * connection, the (non-yjs) mode/initial-data context, and widget selection.
 */
export const TemplateProvider: React.FC<TemplateProviderProps> = ({
  mode,
  template,
  children,
}) => (
  <TemplateDocProvider templateId={template.id}>
    <TemplateMetaContext.Provider value={{ id: template.id, mode, initial: template }}>
      <WidgetSelectionProvider>{children}</WidgetSelectionProvider>
    </TemplateMetaContext.Provider>
  </TemplateDocProvider>
);

type WidgetSelection = ReturnType<typeof useSelection<Widget, "id">>;
const WidgetSelectionContext = createContext<WidgetSelection | null>(null);

const WidgetSelectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { widgets } = useTemplateState();
  const selection = useSelection(values(widgets), "id");

  return (
    <WidgetSelectionContext.Provider value={selection}>
      {children}
    </WidgetSelectionContext.Provider>
  );
};

export function useTemplateId(): string {
  return useTemplateMeta().id;
}

export function useTemplateMode(): TemplateMode {
  return useTemplateMeta().mode;
}

export function useWidgetSelection(): WidgetSelection {
  const ctx = useContext(WidgetSelectionContext);
  if (!ctx) {
    throw new Error("useWidgetSelection must be used inside TemplateProvider");
  }
  return ctx;
}
