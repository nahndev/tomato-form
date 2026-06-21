"use client";

import {
  useTemplateYjs,
  UseTemplateYjsReturn,
} from "@/features/template/hooks/useTemplateYjs";
import type { Template, TemplateMode } from "@/types/template";
import { createContext, useContext } from "react";

const TemplateContext = createContext<{
  templateYjs: UseTemplateYjsReturn;
  mode: TemplateMode;
} | null>(null);

export interface TemplateProviderProps {
  mode: TemplateMode;
  template: Template;
  children: React.ReactNode;
}

export const TemplateProvider: React.FC<TemplateProviderProps> = ({
  mode,
  template,
  children,
}) => {
  const templateYjs = useTemplateYjs(template.id, template);

  return (
    <TemplateContext.Provider value={{ templateYjs, mode }}>
      {children}
    </TemplateContext.Provider>
  );
};

export function useTemplateContext(): UseTemplateYjsReturn {
  const ctx = useContext(TemplateContext);
  if (!ctx) {
    throw new Error("useTemplateContext must be used inside TemplateProvider");
  }
  return ctx.templateYjs;
}

export interface TemplateBuilderContextValue {
  viewOnly: boolean;
}
export function useTemplateMode(): TemplateBuilderContextValue {
  const ctx = useContext(TemplateContext);
  if (!ctx) {
    throw new Error("useTemplateMode must be used inside TemplateProvider");
  }

  return {
    viewOnly: ctx.mode === "view",
  };
}
