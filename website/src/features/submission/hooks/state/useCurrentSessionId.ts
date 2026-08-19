"use client";

import { useSubmissionMeta } from "@/features/submission/hooks/state/useSubmissionMeta";
import { useVisibleSessions } from "@/features/submission/hooks/state/useVisibleSessions";

/** The session currently shown in the fill wizard - defaults to the first visible session (by declared order) until a `SUBMIT`/`RETURN` action sets one explicitly. */
export function useCurrentSessionId(): string | undefined {
  const { currentSessionId } = useSubmissionMeta();
  const visibleSessions = useVisibleSessions();
  return currentSessionId ?? visibleSessions[0]?.id;
}
