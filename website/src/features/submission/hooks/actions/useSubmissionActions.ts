"use client";

import { useSubmissionDoc } from "@/features/submission/components/provider/SubmissionDocProvider";
import { useCallback } from "react";

export interface SubmissionActions {
  setValue: (widgetId: string, value: unknown) => void;
}

/**
 * Action-only, no exposed state - mutates the doc, never re-renders on data
 * change (mirrors `useWidgetActions`).
 */
export function useSubmissionActions(): SubmissionActions {
  const doc = useSubmissionDoc();

  const setValue = useCallback(
    (widgetId: string, value: unknown) => {
      doc.transact(() => {
        doc.getMap<unknown>("values").set(widgetId, value);
      });
    },
    [doc],
  );

  return { setValue };
}
