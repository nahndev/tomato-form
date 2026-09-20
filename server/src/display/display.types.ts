import type { DisplayType } from "@/widget-value";

export type SubmissionDisplayValue = Partial<Record<DisplayType, unknown>>;

/** `{ [widgetId]: { [property]: { [displayType]: value } } }` - one entry per widget value-property, always present (backfilled with its `WidgetValueInterface`'s default) so the UI can render every field without checking for missing data. */
export type SubmissionDisplayDoc = Record<string, Record<string, SubmissionDisplayValue>>;

/** The slice of `Submission` a doc builder needs - just its current values, keyed by widget id. */
export interface DisplaySubmission {
  data: Record<string, unknown>;
}
