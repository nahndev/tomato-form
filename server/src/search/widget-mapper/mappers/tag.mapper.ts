import { SubmissionSearchDoc } from "../../submission-search.types";
import { TagMapperInterface } from "../widget-mapper.types";

/** Pushes a `key:value` tag per entry (single value or array) onto the doc. */
export class TagMapper implements TagMapperInterface {
  map(doc: SubmissionSearchDoc, key: string, value: unknown): SubmissionSearchDoc {
    const entries = Array.isArray(value) ? value : [value];
    for (const entry of entries) {
      doc.tags.push(`${key}:${String(entry)}`);
    }
    return doc;
  }
}

export class SelectWidgetMapper extends TagMapper {}
export class CheckboxWidgetMapper extends TagMapper {}
export class RadioWidgetMapper extends TagMapper {}
export class UsersWidgetMapper extends TagMapper {}
export class SubmittedByWidgetMapper extends TagMapper {}
