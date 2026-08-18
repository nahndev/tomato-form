"use client";

import { useSubmissionDoc } from "@/features/submission/components/provider/SubmissionDocProvider";
import { useEffect, useState } from "react";
import * as Y from "yjs";

export interface SubmissionMeta {
  currentSessionId?: string;
}

function readSubmissionMeta(doc: Y.Doc): SubmissionMeta {
  return Object.fromEntries(doc.getMap<string>("meta").entries());
}

/** Reads live wizard-navigation state off the doc from the nearest `<SubmissionDocProvider>`. */
export function useSubmissionMeta(): SubmissionMeta {
  const doc = useSubmissionDoc();
  const [meta, setMeta] = useState<SubmissionMeta>(() => readSubmissionMeta(doc));

  useEffect(() => {
    setMeta(readSubmissionMeta(doc));
    const onUpdate = () => setMeta(readSubmissionMeta(doc));
    doc.on("update", onUpdate);
    return () => doc.off("update", onUpdate);
  }, [doc]);

  return meta;
}
