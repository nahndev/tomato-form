import { DISPLAY_TYPE, DisplayType } from "../display-mapper.types";
import { DefaultMapper } from "./default.mapper";

/** Coerces value to a string for text display; defaults to an empty string. */
export class UnSupportMapper extends DefaultMapper {
  protected readonly displayType: DisplayType = DISPLAY_TYPE.TEXT;

  protected getDefaultValue(): string {
    return "";
  }

  protected format(value: unknown): string {
    return String(value);
  }
}

export class TextWidgetDisplayMapper extends UnSupportMapper {}
export class TextAreaWidgetDisplayMapper extends UnSupportMapper {}
