import type { Widget } from "@/template/template.types";
import { Injectable } from "@nestjs/common";
import type { MappingContext } from "../mapping-context";
import { UserValue } from "../values/user.value";
import { VALUE_TYPE, WidgetValueInterface } from "../widget-value.types";

/** `users`/`submitted-by`: a single `default` property, value is a user uuid or an array of user uuids. Resolved through `UserValue` (reads the `MappingContext`'s users) into the `entity` (uuids) and `text` (user names) buckets. */
@Injectable()
export class UserWidgetValue implements WidgetValueInterface {
  constructor(private readonly value: UserValue) {}

  validate(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (Array.isArray(value)) return value.every((entry) => typeof entry === "string");
    return typeof value === "string";
  }

  map(context: MappingContext, widget: Widget): void {
    const raw = context.getRaw(widget.id);
    context.setMapped(widget, {
      [VALUE_TYPE.DEFAULT]: this.value.getMapped(raw, widget, context),
    });
  }
}

@Injectable()
export class UsersWidgetValue extends UserWidgetValue {}
@Injectable()
export class SubmittedByWidgetValue extends UserWidgetValue {}
