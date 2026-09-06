import type { TemplateVersionSnapshot, Widget } from "@/template/template.types";

/**
 * Widget type strings, duplicated (same convention as the `search` module's
 * `WIDGET_TYPE` and the AMQP event contracts) from `website/src/types/widget.ts`'s
 * `WidgetType` - see TASK.md "Filter base on `display-type`". Widget types not
 * listed here (label, signature, button, uploaders, break, session, board,
 * template, number, ...) aren't displayable yet.
 */
export const WIDGET_TYPE = {
  SELECT: "select",
  CHECKBOX: "checkbox",
  RADIO: "radio",
  USERS: "users",
  SUBMITTED_BY: "submitted-by",
  DATE: "date",
  DATETIME: "datetime",
  TIME: "time",
  CREATED_AT: "created-at",
  TEXT: "text",
  TEXT_AREA: "text-area",
} as const;

/** Bucket a widget's value renders under for display - mirrors the `search` module's tag/date/text buckets, see TASK.md "Filter base on `display-type`". */
export const DISPLAY_TYPE = {
  ENTITY: "entity",
  DATE: "date",
  TEXT: "text",
} as const;

export type DisplayType = (typeof DISPLAY_TYPE)[keyof typeof DISPLAY_TYPE];

export type SubmissionDisplayValue = Partial<Record<DisplayType, unknown>>;

/** `{ [widgetKey]: { [displayType]: value } }` - one entry per widget, always present (backfilled with the display-type's default) so the UI can render every field without checking for missing data. */
export type SubmissionDisplayDoc = Record<string, SubmissionDisplayValue>;

/** The slice of `Submission` a mapper needs - just its current values, keyed by widget id. */
export interface DisplayMapperSubmission {
  data: Record<string, unknown>;
}

/** Context passed to every mapper: the submission being displayed and the template version snapshot its widgets were published from. */
export interface DisplayMapperContext {
  submission: DisplayMapperSubmission;
  snapshot: TemplateVersionSnapshot;
}

/** Maps one widget's value from the context's submission into the doc, returning the (mutated) doc so callers can chain/reassign. No getter - the doc is the only thing callers need back. */
export interface DisplayMapperInterface {
  map(doc: SubmissionDisplayDoc, widget: Widget, context: DisplayMapperContext): SubmissionDisplayDoc;
}
