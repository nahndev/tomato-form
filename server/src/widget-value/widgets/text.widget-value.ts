import type { Widget } from "@/template/template.types";
import type { MappingContext } from "../mapping-context";
import { TextValue } from "../values/text.value";
import { VALUE_TYPE, WidgetValueInterface } from "../widget-value.types";

/** `text`/`text-area`: a single `default` property, any raw value accepted (coerced to string). */
export class TextWidgetValue implements WidgetValueInterface {
  private readonly value = new TextValue();

  validate(value: unknown): boolean {
    return value === null || value === undefined || typeof value === "string";
  }

  map(context: MappingContext, widget: Widget): void {
    const raw = context.getRaw(widget.id);
    context.setMapped(widget, { [VALUE_TYPE.DEFAULT]: this.value.getMapped(raw) });
  }
}

export class TextAreaWidgetValue extends TextWidgetValue {}
