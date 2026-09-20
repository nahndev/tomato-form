import type { Widget } from "@/template/template.types";
import {
  DisplayMapperContext,
  SubmissionDisplayDoc,
  VALUE_PROPERTY,
  DisplayMapperInterface as WidgetMapperInterface,
} from "../display-mapper.types";

/**
 * Reads value as an epoch-ms timestamp for date display; defaults to `null` when the value isn't
 * a number. Every date-family widget's properties allow rendering as `TEXT` too (see
 * `WIDGET_VALUE_PROPERTY_REGISTRY`), so every entry also gets a `.text` fallback - which
 * DisplayType a column actually renders is a frontend concern, this doc just needs to have
 * every bucket ready regardless.
 */
export class DateMapper implements WidgetMapperInterface {
  map(
    doc: SubmissionDisplayDoc,
    widget: Widget,
    context: DisplayMapperContext,
  ): SubmissionDisplayDoc {
    const value = context.submission.data[widget.id];
    const resolved = typeof value === "number" ? value : null;
    doc[`${widget.id}:${VALUE_PROPERTY.DEFAULT}`] = {
      date: resolved,
      text: resolved === null ? "" : new Date(resolved).toLocaleDateString(),
    };
    return doc;
  }
}

export class DateWidgetDisplayMapper extends DateMapper {}
export class TimeWidgetDisplayMapper extends DateMapper {}
export class CreatedAtWidgetDisplayMapper extends DateMapper {}

/** The only widget with more than one value-property: exposes `default` (full date+time), `date`, and `time` as separate doc entries, all carrying the same resolved value. */
export class DatetimeWidgetDisplayMapper implements WidgetMapperInterface {
  map(
    doc: SubmissionDisplayDoc,
    widget: Widget,
    context: DisplayMapperContext,
  ): SubmissionDisplayDoc {
    const value = context.submission.data[widget.id];
    const resolved = typeof value === "number" ? value : null;
    const displayValue = {
      date: resolved,
      text: resolved === null ? "" : new Date(resolved).toLocaleDateString(),
    };
    doc[`${widget.id}:${VALUE_PROPERTY.DEFAULT}`] = displayValue;
    doc[`${widget.id}:${VALUE_PROPERTY.DATE}`] = displayValue;
    doc[`${widget.id}:${VALUE_PROPERTY.TIME}`] = displayValue;
    return doc;
  }
}
