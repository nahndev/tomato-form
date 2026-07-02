"use client";

import { useTemplateDocGetter } from "@/features/template/components/provider/TemplateDocProvider";
import { useCallback } from "react";

export interface TemplateActions {
  setName: (name: string) => void;
}

/** Action-only, no exposed state - mutates the doc, never re-renders on data change. */
export function useTemplateActions(): TemplateActions {
  const getDoc = useTemplateDocGetter();

  const setName = useCallback(
    (name: string) => {
      const doc = getDoc();
      const yName = doc.getText("name");
      doc.transact(() => {
        yName.delete(0, yName.length);
        yName.insert(0, name);
      });
    },
    [getDoc],
  );

  return { setName };
}
