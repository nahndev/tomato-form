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
  template: Template;
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
    <TemplateContext.Provider value={{ template, templateYjs, mode }}>
      {children}
    </TemplateContext.Provider>
  );
};

export function useTemplateDocContext(): UseTemplateYjsReturn {
  const ctx = useContext(TemplateContext);
  if (!ctx) {
    throw new Error(
      "useTemplateDocContext must be used inside TemplateProvider",
    );
  }
  return ctx.templateYjs;
}

export function useTemplateContext(): Template {
  const ctx = useContext(TemplateContext);
  if (!ctx) {
    throw new Error("useTemplate must be used inside TemplateProvider");
  }
  return ctx.template;
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
