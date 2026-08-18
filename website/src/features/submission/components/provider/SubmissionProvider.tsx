"use client";

import { SubmissionDocProvider } from "@/features/submission/components/provider/SubmissionDocProvider";
import type { Submission } from "@/types/submission";
import { createContext, useContext } from "react";

export interface SubmissionProviderProps {
  submission: Submission;
  children: React.ReactNode;
}

const SubmissionMetaContext = createContext<Submission | null>(null);

/**
 * Public composition root for the submission feature: wires up the values
 * yjs doc connection alongside the (non-yjs) submission REST snapshot.
 * Assumes it's nested inside a `<TemplateProvider>` supplying the read-only
 * template structure (sessions/widgets/layouts) this submission fills in.
 */
export const SubmissionProvider: React.FC<SubmissionProviderProps> = ({
  submission,
  children,
}) => {
  return (
    <SubmissionDocProvider uuid={submission.id}>
      <SubmissionMetaContext.Provider value={submission}>
        {children}
      </SubmissionMetaContext.Provider>
    </SubmissionDocProvider>
  );
};

export function useCurrentSubmission(): Submission {
  const submission = useContext(SubmissionMetaContext);
  if (!submission) {
    throw new Error("useCurrentSubmission must be used inside SubmissionProvider");
  }
  return submission;
}
