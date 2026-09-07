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
    const widgetId = JsonColumn.getItemWidgetId(
      column,
      JsonSubmission.getTemplateId(submission)
    );
    if (widgetId === null) return undefined;

    return submission.dataDisplays[widgetId];
  }
}
