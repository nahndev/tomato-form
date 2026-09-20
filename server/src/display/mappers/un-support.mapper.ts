import type { Widget } from "@/template/template.types";
import { DISPLAY_TYPE, DisplayMapperContext, DisplayMapperInterface, SubmissionDisplayDoc, VALUE_PROPERTY } from "../display-mapper.types";

/** Coerces value to a string for text display; defaults to an empty string. */
export class UnSupportMapper implements DisplayMapperInterface {
  map(doc: SubmissionDisplayDoc, widget: Widget, context: DisplayMapperContext): SubmissionDisplayDoc {
    const value = context.submission.data[widget.id];
    const resolved = value === null || value === undefined ? "" : String(value);
    doc[`${widget.id}:${VALUE_PROPERTY.DEFAULT}`] = { [DISPLAY_TYPE.TEXT]: resolved };
    return doc;
  }
}

export class TextWidgetDisplayMapper extends UnSupportMapper {}
export class TextAreaWidgetDisplayMapper extends UnSupportMapper {}
