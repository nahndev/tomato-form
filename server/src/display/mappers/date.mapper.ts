import { DISPLAY_TYPE, DisplayType, SubmissionDisplayValue, VALUE_PROPERTY } from "../display-mapper.types";
import { DefaultMapper } from "./default.mapper";

/**
 * Parses value into an epoch-ms timestamp for date display; defaults to `null` (including when
 * the value doesn't parse). Every date-family widget's properties allow rendering as `TEXT` too
 * (see `WIDGET_VALUE_PROPERTY_REGISTRY`), so every entry also gets a `.text` fallback - which
 * DisplayType a column actually renders is a frontend concern, this doc just needs to have
 * every bucket ready regardless.
 */
export class DateMapper extends DefaultMapper {
  protected readonly displayType: DisplayType = DISPLAY_TYPE.DATE;

  protected getDefaultValue(): null {
    return null;
  }

  protected format(value: unknown): number | null {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const parsed = Date.parse(value);
      return Number.isNaN(parsed) ? this.getDefaultValue() : parsed;
    }
    return this.getDefaultValue();
  }

  protected buildValue(resolved: unknown): SubmissionDisplayValue {
    return {
      date: resolved,
      text: resolved === null ? "" : new Date(resolved as number).toLocaleDateString(),
    };
  }
}

export class DateWidgetDisplayMapper extends DateMapper {}
export class TimeWidgetDisplayMapper extends DateMapper {}
export class CreatedAtWidgetDisplayMapper extends DateMapper {}

/** The only widget with more than one value-property: exposes `default` (full date+time), `date`, and `time` as separate doc entries, all carrying the same resolved value. */
export class DatetimeWidgetDisplayMapper extends DateMapper {
  protected readonly properties = [VALUE_PROPERTY.DEFAULT, VALUE_PROPERTY.DATE, VALUE_PROPERTY.TIME];
}
