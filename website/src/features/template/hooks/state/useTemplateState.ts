"use client";

import type { TemplateState } from "@/features/template/hooks/internal/templateStateReader";
import { createContext, useContext } from "react";

/**
 * Holds the current `TemplateState`, however it's sourced - a live yjs doc
 * (`TemplateLiveStateProvider`, template builder/edit) or a static published
 * snapshot (`TemplateVersionStateProvider`, submission fill-out). Every
 * doc-independent consumer (`useSessionState`, `SessionCanvas`,
 * `WidgetItem`, ...) only ever reads through `useTemplateState()`.
 */
export const TemplateStateContext = createContext<TemplateState | null>(null);

export function useTemplateState(): TemplateState {
  const state = useContext(TemplateStateContext);
  if (!state) {
    throw new Error(
      "useTemplateState must be used inside a template-state provider (TemplateProvider or TemplateVersionStateProvider)",
    );
  }
  return state;
}
