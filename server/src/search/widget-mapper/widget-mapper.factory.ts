import { CreatedAtWidgetMapper, DateWidgetMapper, DatetimeWidgetMapper, TimeWidgetMapper } from "./mappers/date.mapper";
import {
  CheckboxWidgetMapper,
  RadioWidgetMapper,
  SelectWidgetMapper,
  SubmittedByWidgetMapper,
  UsersWidgetMapper,
} from "./mappers/tag.mapper";
import { TextAreaWidgetMapper, TextWidgetMapper } from "./mappers/text.mapper";
import { WIDGET_TYPE, WidgetDataMapper } from "./widget-mapper.types";

/** Resolves a widget type string to the `WidgetDataMapper` that knows how to index its value. Add new widget types by registering them here - the type not being registered means it isn't indexed yet. */
export class WidgetMapperFactory {
  private static readonly mappers: Partial<Record<string, WidgetDataMapper>> = {
    [WIDGET_TYPE.SELECT]: new SelectWidgetMapper(),
    [WIDGET_TYPE.CHECKBOX]: new CheckboxWidgetMapper(),
    [WIDGET_TYPE.RADIO]: new RadioWidgetMapper(),
    [WIDGET_TYPE.USERS]: new UsersWidgetMapper(),
    [WIDGET_TYPE.SUBMITTED_BY]: new SubmittedByWidgetMapper(),
    [WIDGET_TYPE.DATE]: new DateWidgetMapper(),
    [WIDGET_TYPE.DATETIME]: new DatetimeWidgetMapper(),
    [WIDGET_TYPE.TIME]: new TimeWidgetMapper(),
    [WIDGET_TYPE.CREATED_AT]: new CreatedAtWidgetMapper(),
    [WIDGET_TYPE.TEXT]: new TextWidgetMapper(),
    [WIDGET_TYPE.TEXT_AREA]: new TextAreaWidgetMapper(),
  };

  static getMapper(widgetType: string): WidgetDataMapper | undefined {
    return this.mappers[widgetType];
  }
}
