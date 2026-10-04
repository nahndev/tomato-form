import type { Widget } from "@/template/template.types";
import type { MappingContext } from "../mapping-context";
import { ChoiceTextValue } from "../values/choice-text.value";
import { EntityValue } from "../values/entity.value";
import {
  TextValueInterface,
  VALUE_TYPE,
  ValueInterface,
  WidgetValueInterface,
} from "../widget-value.types";

/** `select`/`checkbox`/`radio`: exposes `default` (the raw option key(s), as an entity list) and `text` (those keys resolved to the widget's option text, comma-joined). The raw value is a key or an array of keys. */
export class ChoiceWidgetValue
  implements WidgetValueInterface, TextValueInterface
{
  private readonly value = new EntityValue();

  validate(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (Array.isArray(value))
      return value.every((entry) => typeof entry === "string");
    return typeof value === "string";
  }

  getTextValue(widget: Widget): ValueInterface {
    return new ChoiceTextValue(widget.options);
  }

  map(context: MappingContext, widget: Widget): void {
    const raw = context.getRaw(widget.id);
    console.log(raw);
    context.setMapped(widget, {
      [VALUE_TYPE.DEFAULT]: this.value.getMapped(raw),
      [VALUE_TYPE.TEXT]: this.getTextValue(widget).getMapped(raw),
    });
  }
}

export class SelectWidgetValue extends ChoiceWidgetValue {}
export class CheckboxWidgetValue extends ChoiceWidgetValue {}
export class RadioWidgetValue extends ChoiceWidgetValue {}
