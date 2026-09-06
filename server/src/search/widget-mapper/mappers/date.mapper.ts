import { SubmissionSearchDoc } from "../../submission-search.types";
import { DateMapperInterface } from "../widget-mapper.types";

/** Parses the value into an epoch-ms timestamp and pushes it onto the doc's `date` bucket; skips values that don't parse. */
export class DateMapper implements DateMapperInterface {
  map(doc: SubmissionSearchDoc, key: string, value: unknown): SubmissionSearchDoc {
    const timestamp = this.toTimestamp(value);
    if (timestamp !== null) doc.date.push({ key, value: timestamp });
    return doc;
  }

  protected toTimestamp(value: unknown): number | null {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const parsed = Date.parse(value);
      return Number.isNaN(parsed) ? null : parsed;
    }
    return null;
  }
}

export class DateWidgetMapper extends DateMapper {}
export class DatetimeWidgetMapper extends DateMapper {}
export class TimeWidgetMapper extends DateMapper {}
export class CreatedAtWidgetMapper extends DateMapper {}
