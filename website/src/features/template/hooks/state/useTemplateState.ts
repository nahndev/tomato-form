"use client";

import { useTemplateDoc } from "@/features/template/components/provider/TemplateDocProvider";
import { useTemplateMeta } from "@/features/template/hooks/internal/templateMeta";
import {
  readTemplateState,
  templateToState,
  type TemplateState,
} from "@/features/template/hooks/internal/templateStateReader";
import { useEffect, useState } from "react";

/**
 * State-only, doc-independent: falls back to the nearest `<TemplateProvider>`'s
 * initial data, and layers live yjs updates on top once `<TemplateDocProvider>`
 * connects the doc.
 */
export function useTemplateState(): TemplateState {
  const doc = useTemplateDoc();
  const { initial } = useTemplateMeta();

  const [state, setState] = useState<TemplateState>(() =>
    doc ? readTemplateState(doc) : templateToState(initial),
  );

  useEffect(() => {
    if (!doc) {
      setState(templateToState(initial));
      return;
    }

    setState(readTemplateState(doc));
    const onUpdate = () => setState(readTemplateState(doc));
    doc.on("update", onUpdate);
    return () => doc.off("update", onUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc]);

  return state;
}
