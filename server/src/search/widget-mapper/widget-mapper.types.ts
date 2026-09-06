import { SubmissionSearchDoc } from "../submission-search.types";

/** Widget type strings duplicated from `website/src/types/widget.ts`'s `WidgetType` (same convention as the AMQP event contracts) - see TASK.md "Filter base on `display-type`". Widget types not listed here (label, signature, button, uploaders, break, session, board, template, number, ...) aren't indexed yet. */
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

export type WidgetType = (typeof WIDGET_TYPE)[keyof typeof WIDGET_TYPE];

/** Maps one widget's value into a `SubmissionSearchDoc`, returning the (mutated) doc so callers can chain/reassign. */
export interface WidgetDataMapper {
  map(doc: SubmissionSearchDoc, key: string, value: unknown): SubmissionSearchDoc;
}

/** Mapper for widget types whose value(s) should be indexed as `tags` (entity/option-style filtering). */
export interface TagMapperInterface extends WidgetDataMapper {}

/** Mapper for widget types whose value should be indexed as an epoch-ms timestamp under `date`. */
export interface DateMapperInterface extends WidgetDataMapper {}

/** Mapper for widget types whose value should be indexed as a string under `text`. */
export interface TextMapperInterface extends WidgetDataMapper {}
