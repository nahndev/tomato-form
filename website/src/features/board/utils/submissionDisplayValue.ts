import type { SubmissionDisplayValue } from "@/types/submission-display";

/**
 * No "number" bucket exists in `SubmissionDisplayDoc` yet - numeric widgets
 * are only backfilled under `text` - so this parses that. Shared by
 * `NumberValue` (rendering) and chart aggregation (grouping/summing).
 */
export function parseNumberDisplayValue(
  value: SubmissionDisplayValue | undefined,
): number | null {
  const text = value?.text;
  const parsed = typeof text === "string" && text.length > 0 ? Number(text) : NaN;
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * A human-readable label for a display value: its `text` bucket, or its
 * `entity` bucket joined, whichever is present. Shared by `TextValue`
 * (rendering) and chart aggregation (group-by labels).
 */
export function parseLabelDisplayValue(
  value: SubmissionDisplayValue | undefined,
): string | null {
  const text = value?.text;
  if (typeof text === "string" && text.length > 0) return text;

  const entity = value?.entity;
  if (Array.isArray(entity) && entity.length > 0) return entity.join(", ");

  return null;
}
