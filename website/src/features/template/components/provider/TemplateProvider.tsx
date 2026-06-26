"use client";

import { useSelection } from "@/features/template/hooks/useSelection";
import {
  useTemplateYjs,
  UseTemplateYjsReturn,
} from "@/features/template/hooks/useTemplateYjs";
import type { Template, TemplateMode, Widget } from "@/types/template";
import { createContext, useContext } from "react";
import { values } from "remeda";

const TemplateContext = createContext<{
  templateYjs: UseTemplateYjsReturn;
  mode: TemplateMode;
  template: Template;
  selection: ReturnType<typeof useSelection<Widget, "id">>;
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
  const selection = useSelection(values(templateYjs.state.widgets), "id");

  return (
    <TemplateContext.Provider
      value={{ template, templateYjs, mode, selection }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

function useProviderContext() {
  const ctx = useContext(TemplateContext);
  if (!ctx) {
    throw new Error(
      "useTemplateDocContext must be used inside TemplateProvider",
    );
  }
  return ctx;
}

export const useTemplateDocContext = () => useProviderContext().templateYjs;
export const useTemplateContext = () => useProviderContext().template;
export const useWidgetSelection = () => useProviderContext().selection;
export const useTemplateMode = () => useProviderContext().mode;
