import type { Widget } from "@/template/template.types";
import {
  DisplayMapperContext,
  DisplayMapperInterface,
  DisplayType,
  SubmissionDisplayDoc,
} from "../display-mapper.types";

/** Base every display mapper extends - falls back to the display-type's default value (e.g. text -> "", date -> null, entity -> []) whenever the submission has no value for the widget, so a field always renders something instead of being absent from the doc. */
export abstract class DefaultMapper implements DisplayMapperInterface {
  protected abstract readonly displayType: DisplayType;

  protected abstract getDefaultValue(): unknown;

  protected format(value: unknown): unknown {
    return value;
  }

  map(doc: SubmissionDisplayDoc, widget: Widget, context: DisplayMapperContext): SubmissionDisplayDoc {
    const value = context.submission.data[widget.id];
    const resolved = value === null || value === undefined ? this.getDefaultValue() : this.format(value);
    doc[widget.id] = { [this.displayType]: resolved };
    return doc;
  }
}
