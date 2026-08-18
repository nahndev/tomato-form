"use client";

import { useSubmissionDoc } from "@/features/submission/components/provider/SubmissionDocProvider";
import { useEffect, useState } from "react";
import * as Y from "yjs";

export type SubmissionValues = Record<string, unknown>;

function readSubmissionValues(doc: Y.Doc): SubmissionValues {
  return Object.fromEntries(doc.getMap<unknown>("values").entries());
}

/** Reads live values off the doc from the nearest `<SubmissionDocProvider>`. */
export function useSubmissionValues(): SubmissionValues {
  const doc = useSubmissionDoc();
  const [values, setValues] = useState<SubmissionValues>(() =>
    readSubmissionValues(doc),
  );

  useEffect(() => {
    setValues(readSubmissionValues(doc));
    const onUpdate = () => setValues(readSubmissionValues(doc));
    doc.on("update", onUpdate);
    return () => doc.off("update", onUpdate);
  }, [doc]);

  return values;
}
