import { JsonColumn } from "@/features/board/utils/column";
import type { BoardColumn } from "@/types/board";
import type { Submission } from "@/types/submission";
import type { SubmissionDisplayValue } from "@/types/submission-display";

/**
 * Single point of access for the Submission json shape, mirroring JsonColumn.
 */
export class JsonSubmission {
  static getTemplateId(submission: Submission): string {
    return submission.templateId;
  }

  static getDisplayValue(
    submission: Submission,
    column: BoardColumn
  ): SubmissionDisplayValue | undefined {
    const itemKey = JsonColumn.getItem(
      column,
      JsonSubmission.getTemplateId(submission)
    );
    if (itemKey === null) return undefined;

    return JsonSubmission.getDisplayValueForItemKey(submission, itemKey);
  }

  /** Looks up a submission's display value directly by a `widgetId:property` compound key. */
  static getDisplayValueForItemKey(
    submission: Submission,
    itemKey: string
  ): SubmissionDisplayValue | undefined {
    return submission.dataDisplays[itemKey];
  }
}
