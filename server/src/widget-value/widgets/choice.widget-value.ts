import type { Widget } from "@/template/template.types";
import { Injectable } from "@nestjs/common";
import type { MappingContext } from "../mapping-context";
import { ChoiceValue } from "../values/choice.value";
import { VALUE_TYPE, WidgetValueInterface } from "../widget-value.types";

/** `select`/`checkbox`/`radio`: a single `default` property, value is an option key or an array of option keys. Resolved through `ChoiceValue` (reads the widget's `options`) into the `entity` (keys) and `text` (option text) buckets. */
@Injectable()
export class ChoiceWidgetValue implements WidgetValueInterface {
  constructor(private readonly value: ChoiceValue) {}

  validate(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (Array.isArray(value)) return value.every((entry) => typeof entry === "string");
    return typeof value === "string";
  }

  map(context: MappingContext, widget: Widget): void {
    const raw = context.getRaw(widget.id);
    context.setMapped(widget, {
      [VALUE_TYPE.DEFAULT]: this.value.getMapped(raw, widget),
    });
  }
}

@Injectable()
export class SelectWidgetValue extends ChoiceWidgetValue {}
@Injectable()
export class CheckboxWidgetValue extends ChoiceWidgetValue {}
@Injectable()
export class RadioWidgetValue extends ChoiceWidgetValue {}
