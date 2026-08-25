"use client";

import type { TemplateState } from "@/features/template/hooks/internal/templateStateReader";
import { TemplateStateContext } from "@/features/template/hooks/state/useTemplateState";
import type { TemplateVersion } from "@/types/template";
import { createContext, useContext, useMemo } from "react";

export interface TemplateVersionStateProviderProps {
  templateVersion: TemplateVersion;
  children: React.ReactNode;
}

const TemplateVersionMetaContext = createContext<TemplateVersion | null>(null);

/**
 * Feeds a published (static) `TemplateVersion` snapshot into the same
 * `TemplateStateContext` the live template builder uses, so every
 * doc-independent consumer (`SessionCanvas`, `WidgetItem`, ...) renders
 * unmodified - no yjs doc connection needed since the structure is frozen.
 */
export const TemplateVersionStateProvider: React.FC<TemplateVersionStateProviderProps> = ({
  templateVersion,
  children,
}) => {
  const state = useMemo<TemplateState>(
    () => ({
      name: templateVersion.template?.name ?? "",
      widgets: templateVersion.snapshot.widgets,
      sessions: templateVersion.snapshot.sessions,
      layouts: templateVersion.snapshot.layouts,
      widgetToSession: templateVersion.snapshot.widgetToSession,
    }),
    [templateVersion],
  );

  return (
    <TemplateStateContext.Provider value={state}>
      <TemplateVersionMetaContext.Provider value={templateVersion}>
        {children}
      </TemplateVersionMetaContext.Provider>
    </TemplateStateContext.Provider>
  );
};

export function useCurrentTemplateVersion(): TemplateVersion {
  const ctx = useContext(TemplateVersionMetaContext);
  if (!ctx) {
    throw new Error(
      "useCurrentTemplateVersion must be used inside <TemplateVersionStateProvider>",
    );
  }
  return ctx;
}
