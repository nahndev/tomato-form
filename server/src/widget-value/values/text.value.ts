import { DISPLAY_TYPE, ValueInterface, ValueMap } from "../widget-value.types";

/** Coerces a value to a string for text display; defaults to an empty string. */
export class TextValue implements ValueInterface {
  getMapped(value: unknown): ValueMap {
    const resolved = value === null || value === undefined ? "" : String(value);
    return { [DISPLAY_TYPE.TEXT]: resolved };
  }
}
