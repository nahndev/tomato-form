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
    const item = JsonColumn.getItem(
      column,
      JsonSubmission.getTemplateId(submission)
    );
    if (item === null) return undefined;

    return submission.dataDisplays[`${item.widgetId}:${item.property}`];
  }
}
