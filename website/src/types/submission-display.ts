/**
 * Mirrors the server's `SubmissionDisplayDoc` (server/src/display/display-mapper.types.ts):
 * one entry per displayable widget, keyed by widget id, always backfilled with
 * the bucket's default so the UI never has to check for missing data.
 */
export const SUBMISSION_DISPLAY_BUCKET = {
  ENTITY: "entity",
  DATE: "date",
  TEXT: "text",
} as const;

export type SubmissionDisplayBucket =
  (typeof SUBMISSION_DISPLAY_BUCKET)[keyof typeof SUBMISSION_DISPLAY_BUCKET];

export type SubmissionDisplayValue = Partial<
  Record<SubmissionDisplayBucket, unknown>
>;

/** `{ [widgetId]: { [bucket]: value } }` */
export type SubmissionDisplayDoc = Record<string, SubmissionDisplayValue>;
