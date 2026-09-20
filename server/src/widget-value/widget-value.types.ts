import type { Widget } from "@/template/template.types";
import type { MappingContext } from "./mapping-context";

/**
 * Widget type strings, duplicated (same convention as the `search` module's
 * `WIDGET_TYPE` and the AMQP event contracts) from `website/src/types/widget.ts`'s
 * `WidgetType`. Widget types not listed here (label, signature, button, uploaders,
 * break, session, board, template, number, ...) don't have a value contract yet.
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

/** Bucket a value-property's resolved value renders under. */
export const DISPLAY_TYPE = {
  ENTITY: "entity",
  DATE: "date",
  TEXT: "text",
} as const;

export type DisplayType = (typeof DISPLAY_TYPE)[keyof typeof DISPLAY_TYPE];

/**
 * Which value-property of a widget an entry belongs to (e.g. `datetime`'s `date`/`time`
 * sub-views vs its `default` full value) - mirrors `ValueType` in
 * `website/src/features/board/constants/column/valueTypes.ts`, hand mirrored since
 * there's no shared-types package between web and server in this monorepo.
 */
export const VALUE_TYPE = {
  DEFAULT: "default",
  DATE: "date",
  TIME: "time",
} as const;

export type ValueType = (typeof VALUE_TYPE)[keyof typeof VALUE_TYPE];

/** One value-property resolved into every `DisplayType` bucket it supports, e.g. `{ date: 123, text: "1/1/2024" }`. */
export type ValueMap = Partial<Record<DisplayType, unknown>>;

/** One value-property's contract: resolves a widget's raw value into its `ValueMap`. Shared building block - several widget types reuse the same `ValueInterface` (e.g. every date-family widget type reuses `DateValue`). */
export interface ValueInterface {
  getMapped(value: unknown): ValueMap;
}

/**
 * The full per-widget-type value contract: validates a raw submitted value against the
 * widget's expected shape, and maps it into every value-property it exposes (`default`,
 * plus any extra ones - currently only `datetime`'s `date`/`time`), writing each one onto
 * the `MappingContext` passed in. This is the single contract `display` (and, eventually,
 * `search` and the submission DTOs) read a widget's value through, instead of each
 * re-deriving its own notion of the value's shape.
 */
export interface WidgetValueInterface {
  validate(value: unknown): boolean;
  map(context: MappingContext, widget: Widget): void;
}

/** Exposed by a widget-value class that has a `date` value-property distinct from its `default` one (currently only `datetime`). */
export interface DateValueInterface {
  getDateValue(): ValueInterface;
}

/** Exposed by a widget-value class that has a `time` value-property distinct from its `default` one (currently only `datetime`). */
export interface TimeValueInterface {
  getTimeValue(): ValueInterface;
}
