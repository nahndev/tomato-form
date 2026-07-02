import type { Template, TemplateMode } from "@/types/template";
import { createContext, useContext } from "react";

export interface TemplateMetaValue {
  id: string;
  mode: TemplateMode;
  /** Server-fetched snapshot, used as a fallback until the yjs doc connects/syncs. */
  initial: Template;
}

export const TemplateMetaContext = createContext<TemplateMetaValue | null>(null);

export function useTemplateMeta(): TemplateMetaValue {
  const ctx = useContext(TemplateMetaContext);
  if (!ctx) {
    throw new Error("This hook must be used inside <TemplateProvider>");
  }
  return ctx;
}
