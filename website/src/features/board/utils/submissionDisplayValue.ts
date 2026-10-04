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
  const parsed =
    typeof text === "string" && text.length > 0 ? Number(text) : NaN;
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * A human-readable label for a display value: its `text` bucket, or its
 * `entity` bucket joined, whichever is present. When both are present (choice
 * and user widgets), `text` is authoritative: it already skipped keys that no
 * longer resolve, so an empty `text` must not fall back to the raw keys.
 * Shared by `TextValue` (rendering) and chart aggregation (group-by labels).
 */
export function parseLabelDisplayValue(
  value: SubmissionDisplayValue | undefined,
): string | null {
  const text = value?.text;
  const entity = value?.entity;
  const hasText = typeof text === "string" && text.length > 0;
  if (hasText) return text;
  if (typeof text === "string" && entity !== undefined) return null;

  if (Array.isArray(entity) && entity.length > 0) return entity.join(", ");

  return null;
}
