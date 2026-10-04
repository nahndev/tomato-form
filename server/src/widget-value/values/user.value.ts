import { DISPLAY_TYPE, ValueInterface, ValueMap } from "../widget-value.types";
import { CHOICE_TEXT_SEPARATOR } from "./choice.value";
import { EntityValue } from "./entity.value";

/**
 * Resolves the referenced user uuid(s) into both display buckets: `entity` (the raw uuids, via
 * `EntityValue`) and `text` (the users' names, in selection order, joined by `CHOICE_TEXT_SEPARATOR`).
 * Uuids with no matching user (e.g. the user was since deleted) are skipped from `text`; it
 * defaults to an empty string.
 */
export class UserValue implements ValueInterface {
  private readonly entityValue = new EntityValue();

  constructor(private readonly users: ReadonlyMap<string, string>) {}

  getMapped(value: unknown): ValueMap {
    const entity = this.entityValue.getMapped(value)[DISPLAY_TYPE.ENTITY] as string[];
    const names = entity.flatMap((uuid) => this.users.get(uuid) ?? []);

    return {
      [DISPLAY_TYPE.ENTITY]: entity,
      [DISPLAY_TYPE.TEXT]: names.join(CHOICE_TEXT_SEPARATOR),
    };
  }
}
