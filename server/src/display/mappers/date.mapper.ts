import { DISPLAY_TYPE, DisplayType } from "../display-mapper.types";
import { DefaultMapper } from "./default.mapper";

/** Parses value into an epoch-ms timestamp for date display; defaults to `null` (including when the value doesn't parse). */
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
}

export class DateWidgetDisplayMapper extends DateMapper {}
export class DatetimeWidgetDisplayMapper extends DateMapper {}
export class TimeWidgetDisplayMapper extends DateMapper {}
export class CreatedAtWidgetDisplayMapper extends DateMapper {}
