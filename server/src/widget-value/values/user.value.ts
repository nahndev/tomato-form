import type { Widget } from "@/template/template.types";
import { Injectable } from "@nestjs/common";
import type { MappingContext } from "../mapping-context";
import { DISPLAY_TYPE, ValueInterface, ValueMap } from "../widget-value.types";
import { CHOICE_TEXT_SEPARATOR } from "./choice.value";
import { EntityValue } from "./entity.value";

/**
 * Resolves the referenced user uuid(s) into both display buckets: `entity` (the raw uuids, via
 * `EntityValue`) and `text` (the users' names, in selection order, joined by `CHOICE_TEXT_SEPARATOR`).
 * Uuids with no matching user (e.g. the user was since deleted) are skipped from `text`; it
 * defaults to an empty string.
 */
@Injectable()
export class UserValue implements ValueInterface {
  constructor(private readonly entityValue: EntityValue) {}

  getMapped(value: unknown, _widget: Widget, context: MappingContext): ValueMap {
    const entity = this.entityValue.getMapped(value)[DISPLAY_TYPE.ENTITY] as string[];
    const users = context.getUsers();
    const names = entity.flatMap((uuid) => users.get(uuid) ?? []);

    return {
      [DISPLAY_TYPE.ENTITY]: entity,
      [DISPLAY_TYPE.TEXT]: names.join(CHOICE_TEXT_SEPARATOR),
    };
  }
}
