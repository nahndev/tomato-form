import { SubmissionSearchDoc } from "../../submission-search.types";
import { TextMapperInterface } from "../widget-mapper.types";

/** Pushes the value, coerced to a string, onto the doc's `text` bucket. */
export class TextMapper implements TextMapperInterface {
  map(doc: SubmissionSearchDoc, key: string, value: unknown): SubmissionSearchDoc {
    doc.text.push({ key, value: String(value) });
    return doc;
  }
}

export class TextWidgetMapper extends TextMapper {}
export class TextAreaWidgetMapper extends TextMapper {}
