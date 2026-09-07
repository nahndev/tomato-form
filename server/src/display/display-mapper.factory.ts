import { UnSupportMapper } from "@/display/mappers/un-support.mapper";
import type { Widget } from "@/template/template.types";
import { DisplayMapperInterface, WIDGET_TYPE } from "./display-mapper.types";
import {
  CreatedAtWidgetDisplayMapper,
  DateWidgetDisplayMapper,
  DatetimeWidgetDisplayMapper,
  TimeWidgetDisplayMapper,
} from "./mappers/date.mapper";
import {
  CheckboxWidgetDisplayMapper,
  RadioWidgetDisplayMapper,
  SelectWidgetDisplayMapper,
  SubmittedByWidgetDisplayMapper,
  UsersWidgetDisplayMapper,
} from "./mappers/entity.mapper";
import {
  TextAreaWidgetDisplayMapper,
  TextWidgetDisplayMapper,
} from "./mappers/text.mapper";

/** Resolves a widget type string to the `DisplayMapperInterface` that knows its display-type default and formatting. Add new displayable widget types by registering them here. */
export class DisplayMapperFactory {
  private static readonly mappers: Partial<
    Record<string, DisplayMapperInterface>
  > = {
    [WIDGET_TYPE.SELECT]: new SelectWidgetDisplayMapper(),
    [WIDGET_TYPE.CHECKBOX]: new CheckboxWidgetDisplayMapper(),
    [WIDGET_TYPE.RADIO]: new RadioWidgetDisplayMapper(),
    [WIDGET_TYPE.USERS]: new UsersWidgetDisplayMapper(),
    [WIDGET_TYPE.SUBMITTED_BY]: new SubmittedByWidgetDisplayMapper(),
    [WIDGET_TYPE.DATE]: new DateWidgetDisplayMapper(),
    [WIDGET_TYPE.DATETIME]: new DatetimeWidgetDisplayMapper(),
    [WIDGET_TYPE.TIME]: new TimeWidgetDisplayMapper(),
    [WIDGET_TYPE.CREATED_AT]: new CreatedAtWidgetDisplayMapper(),
    [WIDGET_TYPE.TEXT]: new TextWidgetDisplayMapper(),
    [WIDGET_TYPE.TEXT_AREA]: new TextAreaWidgetDisplayMapper(),
  };

  static getMapper(widget: Widget): DisplayMapperInterface {
    return this.mappers[widget.type] ?? new UnSupportMapper();
  }
}
