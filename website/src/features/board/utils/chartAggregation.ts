import { JsonSubmission } from "@/features/board/utils/submission";
import {
  parseLabelDisplayValue,
  parseNumberDisplayValue,
} from "@/features/board/utils/submissionDisplayValue";
import { ChartAggregation, type BoardChartViewConfig } from "@/types/board-view";
import type { Submission } from "@/types/submission";

export interface ChartDatum {
  label: string;
  value: number;
}

const EMPTY_LABEL = "(empty)";

function resolveGroupLabel(submission: Submission, config: BoardChartViewConfig): string {
  const itemKey = config.groupBy[submission.templateId];
  if (!itemKey) return EMPTY_LABEL;

  const displayValue = JsonSubmission.getDisplayValueForItemKey(submission, itemKey);
  return parseLabelDisplayValue(displayValue) ?? EMPTY_LABEL;
}

function resolveNumericValue(submission: Submission, config: BoardChartViewConfig): number | null {
  const itemKey = config.valueField?.[submission.templateId];
  if (!itemKey) return null;

  const displayValue = JsonSubmission.getDisplayValueForItemKey(submission, itemKey);
  return parseNumberDisplayValue(displayValue);
}

/**
 * Groups submissions by `config.groupBy`'s resolved label and reduces each
 * group by `config.aggregation`. Submissions missing the group-by value are
 * bucketed under "(empty)"; submissions missing the value field (for sum/avg)
 * are excluded from that group's total rather than treated as zero.
 */
export function aggregateSubmissionsForChart(
  submissions: Submission[],
  config: BoardChartViewConfig,
): ChartDatum[] {
  const buckets = new Map<string, number[]>();

  for (const submission of submissions) {
    const label = resolveGroupLabel(submission, config);
    const bucket = buckets.get(label) ?? [];
    buckets.set(label, bucket);

    if (config.aggregation === ChartAggregation.COUNT) {
      bucket.push(1);
      continue;
    }

    const value = resolveNumericValue(submission, config);
    if (value !== null) bucket.push(value);
  }

  return Array.from(buckets.entries()).map(([label, values]) => ({
    label,
    value: reduceBucket(values, config.aggregation),
  }));
}

function reduceBucket(values: number[], aggregation: ChartAggregation): number {
  if (aggregation === ChartAggregation.COUNT) return values.length;

  const sum = values.reduce((total, value) => total + value, 0);
  if (aggregation === ChartAggregation.SUM) return sum;

  return values.length > 0 ? sum / values.length : 0;
}
