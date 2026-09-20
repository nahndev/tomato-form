import { WIDGET_TYPE, WidgetValueInterface } from "./widget-value.types";
import {
  CreatedAtWidgetValue,
  DateWidgetValue,
  DatetimeWidgetValue,
  TimeWidgetValue,
} from "./widgets/date.widget-value";
import {
  CheckboxWidgetValue,
  RadioWidgetValue,
  SelectWidgetValue,
  SubmittedByWidgetValue,
  UsersWidgetValue,
} from "./widgets/entity.widget-value";
import {
  TextAreaWidgetValue,
  TextWidgetValue,
} from "./widgets/text.widget-value";
import { UnSupportWidgetValue } from "./widgets/un-support.widget-value";

/**
 * Resolves a widget type string to the `WidgetValueInterface` that knows how to validate
 * and map its value - the single, shared value contract callers (currently `display`) read
 * a widget's value through instead of re-deriving their own notion of its shape. Add new
 * widget types by registering them here; an unregistered type falls back to
 * `UnSupportWidgetValue` (string coercion), same as the pre-refactor `DisplayMapperFactory`.
 */
export class WidgetValueFactory {
  private static readonly values: Partial<
    Record<string, WidgetValueInterface>
  > = {
    [WIDGET_TYPE.SELECT]: new SelectWidgetValue(),
    [WIDGET_TYPE.CHECKBOX]: new CheckboxWidgetValue(),
    [WIDGET_TYPE.RADIO]: new RadioWidgetValue(),
    [WIDGET_TYPE.USERS]: new UsersWidgetValue(),
    [WIDGET_TYPE.SUBMITTED_BY]: new SubmittedByWidgetValue(),
    [WIDGET_TYPE.DATE]: new DateWidgetValue(),
    [WIDGET_TYPE.DATETIME]: new DatetimeWidgetValue(),
    [WIDGET_TYPE.TIME]: new TimeWidgetValue(),
    [WIDGET_TYPE.CREATED_AT]: new CreatedAtWidgetValue(),
    [WIDGET_TYPE.TEXT]: new TextWidgetValue(),
    [WIDGET_TYPE.TEXT_AREA]: new TextAreaWidgetValue(),
  };

  static getValue(widgetType: string): WidgetValueInterface {
    return this.values[widgetType] ?? new UnSupportWidgetValue();
  }
}
