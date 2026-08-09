"use client";

import type { TemplateMode } from "@/types/template";
import { createContext, useContext } from "react";

const TemplateModeContext = createContext<TemplateMode | null>(null);

export interface TemplateBuilderProviderProps {
  mode: TemplateMode;
  children: React.ReactNode;
}

/**
 * Builder-only concerns for the template feature - currently just view/edit
 * `mode`. Kept separate from `TemplateProvider` so non-builder consumers of
 * a template aren't forced to supply a mode.
 */
export const TemplateBuilderProvider: React.FC<TemplateBuilderProviderProps> = ({
  mode,
  children,
}) => (
  <TemplateModeContext.Provider value={mode}>
    {children}
  </TemplateModeContext.Provider>
);

export function useTemplateMode(): TemplateMode {
  const mode = useContext(TemplateModeContext);
  if (mode === null) {
    throw new Error(
      "useTemplateMode must be used inside <TemplateBuilderProvider>",
    );
  }
  return mode;
}
