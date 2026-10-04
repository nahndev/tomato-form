import type { OptionItem } from "@/template/template.types";
import { DISPLAY_TYPE, ValueInterface, ValueMap } from "../widget-value.types";

export const CHOICE_TEXT_SEPARATOR = ", ";

/** Resolves the selected option key(s) into their display text via the widget's `options`, in selection order, joined by `CHOICE_TEXT_SEPARATOR`. Keys with no matching option (e.g. the option was since deleted) are skipped; defaults to an empty string. */
export class ChoiceTextValue implements ValueInterface {
  constructor(private readonly options: readonly OptionItem[] = []) {}

  getMapped(value: unknown): ValueMap {
    if (value === null || value === undefined) return { [DISPLAY_TYPE.TEXT]: "" };

    const textByKey = new Map(this.options.map((option) => [option.key, option.value]));
    const keys = (Array.isArray(value) ? value : [value]).map(String);
    const texts = keys.flatMap((key) => textByKey.get(key) ?? []);

    return { [DISPLAY_TYPE.TEXT]: texts.join(CHOICE_TEXT_SEPARATOR) };
  }
}
