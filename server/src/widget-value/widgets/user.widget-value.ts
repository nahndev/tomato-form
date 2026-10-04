import type { Widget } from "@/template/template.types";
import type { MappingContext } from "../mapping-context";
import { UserValue } from "../values/user.value";
import { VALUE_TYPE, WidgetValueInterface } from "../widget-value.types";

/** `users`/`submitted-by`: a single `default` property, value is a user uuid or an array of user uuids. Resolved through `UserValue` (needs the `MappingContext`'s users) into the `entity` (uuids) and `text` (user names) buckets. */
export class UserWidgetValue implements WidgetValueInterface {
  validate(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (Array.isArray(value)) return value.every((entry) => typeof entry === "string");
    return typeof value === "string";
  }

  map(context: MappingContext, widget: Widget): void {
    const raw = context.getRaw(widget.id);
    context.setMapped(widget, {
      [VALUE_TYPE.DEFAULT]: new UserValue(context.getUsers()).getMapped(raw),
    });
  }
}

export class UsersWidgetValue extends UserWidgetValue {}
export class SubmittedByWidgetValue extends UserWidgetValue {}
