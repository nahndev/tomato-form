import { DISPLAY_TYPE, ValueInterface, ValueMap } from "../widget-value.types";

/** Formats value(s) as a string array for entity/option-style display (single value or multi-select); defaults to an empty choice list. */
export class EntityValue implements ValueInterface {
  getMapped(value: unknown): ValueMap {
    const resolved =
      value === null || value === undefined
        ? []
        : (Array.isArray(value) ? value : [value]).map(String);
    return { [DISPLAY_TYPE.ENTITY]: resolved };
  }
}
