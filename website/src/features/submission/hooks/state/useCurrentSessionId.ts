"use client";

import { useSubmissionMeta } from "@/features/submission/hooks/state/useSubmissionMeta";
import { useTemplateState } from "@/features/template/hooks/state/useTemplateState";

/** The session currently shown in the fill wizard - defaults to the first session (by declared order) until a `SUBMIT`/`RETURN` action sets one explicitly. */
export function useCurrentSessionId(): string | undefined {
  const { currentSessionId } = useSubmissionMeta();
  const { sessions } = useTemplateState();
  return currentSessionId ?? Object.values(sessions)[0]?.id;
}
