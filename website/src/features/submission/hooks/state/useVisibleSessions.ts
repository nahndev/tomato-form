"use client";

import { evaluateSessionCondition } from "@/features/template/hooks/internal/sessionCondition";
import { useTemplateState } from "@/features/template/hooks/state/useTemplateState";
import { useSubmissionValues } from "@/features/submission/hooks/state/useSubmissionValues";
import type { Session } from "@/types/template";
import { useMemo } from "react";

/** Sessions whose visibility condition currently evaluates true, in declared order. */
export function useVisibleSessions(): Session[] {
  const { sessions } = useTemplateState();
  const values = useSubmissionValues();

  return useMemo(
    () =>
      Object.values(sessions).filter((session) =>
        evaluateSessionCondition(session.condition, values),
      ),
    [sessions, values],
  );
}
