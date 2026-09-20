import type { Widget } from "@/template/template.types";
import {
  DisplayMapperContext,
  DisplayMapperInterface,
  DisplayType,
  SubmissionDisplayDoc,
  SubmissionDisplayValue,
  VALUE_PROPERTY,
  ValueProperty,
} from "../display-mapper.types";

/** Base every display mapper extends - falls back to the display-type's default value (e.g. text -> "", date -> null, entity -> []) whenever the submission has no value for the widget, so a field always renders something instead of being absent from the doc. */
export abstract class DefaultMapper implements DisplayMapperInterface {
  /** Which value-properties this widget exposes; a doc entry is written per property. Only `datetime` overrides this to fan out into `default`/`date`/`time`. */
  protected readonly properties: ValueProperty[] = [VALUE_PROPERTY.DEFAULT];

  protected abstract readonly displayType: DisplayType;

  protected abstract getDefaultValue(): unknown;

  protected format(value: unknown): unknown {
    return value;
  }

  /** The doc value for one property. Defaults to a single bucket; overridden by mappers whose properties allow more than one DisplayType (e.g. date-family widgets also populate a `.text` fallback). */
  protected buildValue(resolved: unknown): SubmissionDisplayValue {
    return { [this.displayType]: resolved };
  }

  map(doc: SubmissionDisplayDoc, widget: Widget, context: DisplayMapperContext): SubmissionDisplayDoc {
    const value = context.submission.data[widget.id];
    const resolved = value === null || value === undefined ? this.getDefaultValue() : this.format(value);
    for (const property of this.properties) {
      doc[`${widget.id}:${property}`] = this.buildValue(resolved);
    }
    return doc;
  }
}
