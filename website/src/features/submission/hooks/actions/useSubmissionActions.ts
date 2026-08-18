"use client";

import { useSubmissionDoc } from "@/features/submission/components/provider/SubmissionDocProvider";
import { useCallback } from "react";

export interface SubmissionActions {
  setValue: (widgetId: string, value: unknown) => void;
  goToSession: (sessionId: string) => void;
  resetValues: (widgetIds: string[]) => void;
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

  const goToSession = useCallback(
    (sessionId: string) => {
      doc.transact(() => {
        doc.getMap<string>("meta").set("currentSessionId", sessionId);
      });
    },
    [doc],
  );

  const resetValues = useCallback(
    (widgetIds: string[]) => {
      doc.transact(() => {
        const values = doc.getMap<unknown>("values");
        for (const widgetId of widgetIds) values.delete(widgetId);
      });
    },
    [doc],
  );

  return { setValue, goToSession, resetValues };
}
