"use client";

import type { TemplateState } from "@/features/template/hooks/internal/templateStateReader";
import { TemplateStateContext } from "@/features/template/hooks/state/useTemplateState";
import type { Template } from "@/types/template";
import { createContext, useContext, useMemo } from "react";

export interface TemplateSnapshotStateProviderProps {
  template: Template;
  children: React.ReactNode;
}

const TemplateMetaContext = createContext<Template | null>(null);

/**
 * Feeds a published (static) `Template.snapshot` into the same
 * `TemplateStateContext` the live template builder uses, so every
 * doc-independent consumer (`SessionCanvas`, `WidgetItem`, ...) renders
 * unmodified - no yjs doc connection needed since the structure is frozen.
 */
export const TemplateSnapshotStateProvider: React.FC<TemplateSnapshotStateProviderProps> = ({
  template,
  children,
}) => {
  const state = useMemo<TemplateState>(
    () => ({
      name: template.name,
      widgets: template.snapshot.widgets,
      sessions: template.snapshot.sessions,
      layouts: template.snapshot.layouts,
      widgetToSession: template.snapshot.widgetToSession,
    }),
    [template],
  );

  return (
    <TemplateStateContext.Provider value={state}>
      <TemplateMetaContext.Provider value={template}>
        {children}
      </TemplateMetaContext.Provider>
    </TemplateStateContext.Provider>
  );
};

export function useCurrentTemplate(): Template {
  const ctx = useContext(TemplateMetaContext);
  if (!ctx) {
    throw new Error(
      "useCurrentTemplate must be used inside <TemplateSnapshotStateProvider>",
    );
  }
  return ctx;
}
