"use client";

import { useTemplateDoc } from "@/features/template/components/provider/TemplateDocProvider";
import {
  readTemplateState,
  type TemplateState,
} from "@/features/template/hooks/internal/templateStateReader";
import { useEffect, useState } from "react";

/** Reads live state off the doc from the nearest `<TemplateDocProvider>`. */
export function useTemplateState(): TemplateState {
  const doc = useTemplateDoc();
  const [state, setState] = useState<TemplateState>(() => readTemplateState(doc));

  useEffect(() => {
    setState(readTemplateState(doc));
    const onUpdate = () => setState(readTemplateState(doc));
    doc.on("update", onUpdate);
    return () => doc.off("update", onUpdate);
  }, [doc]);

  return state;
}
