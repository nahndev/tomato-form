import type { OptionItem } from "@/template/template.types";
import { DISPLAY_TYPE, ValueInterface, ValueMap } from "../widget-value.types";
import { EntityValue } from "./entity.value";

export const CHOICE_TEXT_SEPARATOR = ", ";

/**
 * Resolves the selected option key(s) into both display buckets: `entity` (the raw keys, via
 * `EntityValue`) and `text` (the keys resolved to the widget's option text, in selection order, joined by
 * `CHOICE_TEXT_SEPARATOR`). Keys with no matching option (e.g. the option was since deleted) are
 * skipped from `text`; it defaults to an empty string.
 */
export class ChoiceValue implements ValueInterface {
  private readonly entityValue = new EntityValue();

  constructor(private readonly options: readonly OptionItem[] = []) {}

  getMapped(value: unknown): ValueMap {
    const entity = this.entityValue.getMapped(value)[DISPLAY_TYPE.ENTITY] as string[];
    const textByKey = new Map(this.options.map((option) => [option.key, option.value]));
    const texts = entity.flatMap((key) => textByKey.get(key) ?? []);

    return {
      [DISPLAY_TYPE.ENTITY]: entity,
      [DISPLAY_TYPE.TEXT]: texts.join(CHOICE_TEXT_SEPARATOR),
    };
  }
}
