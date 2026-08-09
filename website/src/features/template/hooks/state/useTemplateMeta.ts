import type { Template } from "@/types/template";
import { createContext, useContext } from "react";

export interface TemplateMetaValue {
  id: string;
  version?: string;
  /** Server-fetched snapshot, used as a fallback until the yjs doc connects/syncs. */
  template: Template;
}

export const TemplateMetaContext = createContext<TemplateMetaValue | null>(null);

export function useTemplateMeta(): TemplateMetaValue {
  const ctx = useContext(TemplateMetaContext);
  if (!ctx) {
    throw new Error("This hook must be used inside <TemplateProvider>");
  }
  return ctx;
}
