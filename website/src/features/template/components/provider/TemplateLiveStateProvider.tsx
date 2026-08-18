"use client";

import { useTemplateDoc } from "@/features/template/components/provider/TemplateDocProvider";
import {
  readTemplateState,
  type TemplateState,
} from "@/features/template/hooks/internal/templateStateReader";
import { TemplateStateContext } from "@/features/template/hooks/state/useTemplateState";
import { useEffect, useState } from "react";

export interface TemplateLiveStateProviderProps {
  children: React.ReactNode;
}

/** Publishes live state off the nearest `<TemplateDocProvider>`'s doc into `TemplateStateContext`. */
export const TemplateLiveStateProvider: React.FC<TemplateLiveStateProviderProps> = ({
  children,
}) => {
  const doc = useTemplateDoc();
  const [state, setState] = useState<TemplateState>(() => readTemplateState(doc));

  useEffect(() => {
    setState(readTemplateState(doc));
    const onUpdate = () => setState(readTemplateState(doc));
    doc.on("update", onUpdate);
    return () => doc.off("update", onUpdate);
  }, [doc]);

  return (
    <TemplateStateContext.Provider value={state}>
      {children}
    </TemplateStateContext.Provider>
  );
};
