import { DISPLAY_TYPE, DisplayType } from "../display-mapper.types";
import { DefaultMapper } from "./default.mapper";

/** Formats value(s) as a string array for entity/option-style display (single value or multi-select); defaults to an empty choice list. */
export class EntityMapper extends DefaultMapper {
  protected readonly displayType: DisplayType = DISPLAY_TYPE.ENTITY;

  protected getDefaultValue(): string[] {
    return [];
  }

  protected format(value: unknown): string[] {
    const entries = Array.isArray(value) ? value : [value];
    return entries.map(String);
  }
}

export class SelectWidgetDisplayMapper extends EntityMapper {}
export class CheckboxWidgetDisplayMapper extends EntityMapper {}
export class RadioWidgetDisplayMapper extends EntityMapper {}
export class UsersWidgetDisplayMapper extends EntityMapper {}
export class SubmittedByWidgetDisplayMapper extends EntityMapper {}
