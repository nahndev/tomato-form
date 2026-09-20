import { DISPLAY_TYPE, ValueInterface, ValueMap } from "../widget-value.types";

/**
 * Reads a value as an epoch-ms timestamp for date display; defaults to `null` when the
 * value isn't a number. Base for the date-family `ValueInterface`s - every date-family
 * value-property also allows rendering as `TEXT`, so `.text` is always populated too
 * (a chosen `DisplayType` should never render blank); subclasses only differ in how
 * that fallback text is formatted.
 */
abstract class BaseDateValue implements ValueInterface {
  getMapped(value: unknown): ValueMap {
    const resolved = typeof value === "number" ? value : null;
    return {
      [DISPLAY_TYPE.DATE]: resolved,
      [DISPLAY_TYPE.TEXT]: resolved === null ? "" : this.formatText(new Date(resolved)),
    };
  }

  protected abstract formatText(date: Date): string;
}

export class DateValue extends BaseDateValue {
  protected formatText(date: Date): string {
    return date.toLocaleDateString();
  }
}

export class TimeValue extends BaseDateValue {
  protected formatText(date: Date): string {
    return date.toLocaleTimeString();
  }
}

export class DateTimeValue extends BaseDateValue {
  protected formatText(date: Date): string {
    return date.toLocaleString();
  }
}
