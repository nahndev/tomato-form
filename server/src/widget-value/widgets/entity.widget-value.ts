import type { Widget } from "@/template/template.types";
import type { MappingContext } from "../mapping-context";
import { EntityValue } from "../values/entity.value";
import { VALUE_TYPE, WidgetValueInterface } from "../widget-value.types";

/** `select`/`checkbox`/`radio`/`users`/`submitted-by`: a single `default` property, value is a tag id or array of tag ids. */
export class EntityWidgetValue implements WidgetValueInterface {
  private readonly value = new EntityValue();

  validate(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (Array.isArray(value)) return value.every((entry) => typeof entry === "string");
    return typeof value === "string";
  }

  map(context: MappingContext, widget: Widget): void {
    const raw = context.getRaw(widget.id);
    context.setMapped(widget, { [VALUE_TYPE.DEFAULT]: this.value.getMapped(raw) });
  }
}

export class SelectWidgetValue extends EntityWidgetValue {}
export class CheckboxWidgetValue extends EntityWidgetValue {}
export class RadioWidgetValue extends EntityWidgetValue {}
export class UsersWidgetValue extends EntityWidgetValue {}
export class SubmittedByWidgetValue extends EntityWidgetValue {}
