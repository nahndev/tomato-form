"use client";

import {
  useTemplateYjs,
  UseTemplateYjsReturn,
} from "@/features/template/hooks/useTemplateYjs";
import type { Template } from "@/types/template";
import { createContext, useContext } from "react";

const TemplateContext = createContext<UseTemplateYjsReturn | null>(null);

export interface TemplateProviderProps {
  template: Template;
  children: React.ReactNode;
}

export const TemplateProvider: React.FC<TemplateProviderProps> = ({
  template,
  children,
}) => {
  const templateYjs = useTemplateYjs(template.id, template);

  return (
    <TemplateContext.Provider value={templateYjs}>
      {children}
    </TemplateContext.Provider>
  );
};

export function useTemplateContext(): UseTemplateYjsReturn {
  const ctx = useContext(TemplateContext);
  if (!ctx) {
    throw new Error("useTemplateContext must be used inside TemplateProvider");
  }
  return ctx;
}
