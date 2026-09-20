import { JsonColumn } from "@/features/board/utils/column";
import { parseItemKey } from "@/features/board/utils/itemKey";
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
    column: BoardColumn,
  ): SubmissionDisplayValue | undefined {
    const item = JsonColumn.getItem(
      column,
      JsonSubmission.getTemplateId(submission),
    );
    if (item === null) return undefined;

    return submission.dataDisplays[item.widgetId]?.[item.property];
  }

  /** Looks up a submission's display value by a `widgetId:property` compound key (the format `BoardChartViewConfig`'s `groupBy`/`valueField` still use), against the nested `dataDisplays[widgetId][property]` doc. */
  static getDisplayValueForItemKey(
    submission: Submission,
    itemKey: string,
  ): SubmissionDisplayValue | undefined {
    const { widgetId, property } = parseItemKey(itemKey);
    return submission.dataDisplays[widgetId]?.[property];
  }
}
