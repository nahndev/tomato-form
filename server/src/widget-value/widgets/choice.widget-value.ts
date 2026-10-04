import type { Widget } from "@/template/template.types";
import type { MappingContext } from "../mapping-context";
import { ChoiceValue } from "../values/choice.value";
import { VALUE_TYPE, WidgetValueInterface } from "../widget-value.types";

/** `select`/`checkbox`/`radio`: a single `default` property, value is an option key or an array of option keys. Resolved through `ChoiceValue` (needs the widget's `options`) into the `entity` (keys) and `text` (option text) buckets. */
export class ChoiceWidgetValue implements WidgetValueInterface {
  validate(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (Array.isArray(value)) return value.every((entry) => typeof entry === "string");
    return typeof value === "string";
  }

  map(context: MappingContext, widget: Widget): void {
    const raw = context.getRaw(widget.id);
    context.setMapped(widget, {
      [VALUE_TYPE.DEFAULT]: new ChoiceValue(widget.options).getMapped(raw),
    });
  }
}

export class SelectWidgetValue extends ChoiceWidgetValue {}
export class CheckboxWidgetValue extends ChoiceWidgetValue {}
export class RadioWidgetValue extends ChoiceWidgetValue {}
