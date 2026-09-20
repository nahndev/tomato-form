import type { Widget } from "@/template/template.types";
import { DISPLAY_TYPE, DisplayMapperContext, DisplayMapperInterface, SubmissionDisplayDoc, VALUE_PROPERTY } from "../display-mapper.types";

/** Formats value(s) as a string array for entity/option-style display (single value or multi-select); defaults to an empty choice list. */
export class EntityMapper implements DisplayMapperInterface {
  map(doc: SubmissionDisplayDoc, widget: Widget, context: DisplayMapperContext): SubmissionDisplayDoc {
    const value = context.submission.data[widget.id];
    const resolved = value === null || value === undefined ? [] : (Array.isArray(value) ? value : [value]).map(String);
    doc[`${widget.id}:${VALUE_PROPERTY.DEFAULT}`] = { [DISPLAY_TYPE.ENTITY]: resolved };
    return doc;
  }
}

export class SelectWidgetDisplayMapper extends EntityMapper {}
export class CheckboxWidgetDisplayMapper extends EntityMapper {}
export class RadioWidgetDisplayMapper extends EntityMapper {}
export class UsersWidgetDisplayMapper extends EntityMapper {}
export class SubmittedByWidgetDisplayMapper extends EntityMapper {}
