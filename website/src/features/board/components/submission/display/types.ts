import type { SubmissionDisplayValue } from "@/types/submission-display";

export interface DisplayValueProps {
  /** This widget's entry from `submission.dataDisplays`; absent when the widget isn't displayable yet. */
  displayValue: SubmissionDisplayValue | undefined;
}
