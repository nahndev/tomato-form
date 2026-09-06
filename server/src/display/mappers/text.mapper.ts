import { DISPLAY_TYPE, DisplayType } from "../display-mapper.types";
import { DefaultMapper } from "./default.mapper";

/** Coerces value to a string for text display; defaults to an empty string. */
export class TextMapper extends DefaultMapper {
  protected readonly displayType: DisplayType = DISPLAY_TYPE.TEXT;

  protected getDefaultValue(): string {
    return "";
  }

  protected format(value: unknown): string {
    return String(value);
  }
}

export class TextWidgetDisplayMapper extends TextMapper {}
export class TextAreaWidgetDisplayMapper extends TextMapper {}
