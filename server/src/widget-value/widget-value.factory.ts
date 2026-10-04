import { Injectable } from "@nestjs/common";
import { WIDGET_TYPE, WidgetValueInterface } from "./widget-value.types";
import {
  CheckboxWidgetValue,
  RadioWidgetValue,
  SelectWidgetValue,
} from "./widgets/choice.widget-value";
import {
  CreatedAtWidgetValue,
  DateWidgetValue,
  DatetimeWidgetValue,
  TimeWidgetValue,
} from "./widgets/date.widget-value";
import { TextAreaWidgetValue, TextWidgetValue } from "./widgets/text.widget-value";
import { UnSupportWidgetValue } from "./widgets/un-support.widget-value";
import { SubmittedByWidgetValue, UsersWidgetValue } from "./widgets/user.widget-value";

/**
 * Resolves a widget type string to the `WidgetValueInterface` that knows how to validate
 * and map its value - the single, shared value contract callers (currently `display`) read
 * a widget's value through instead of re-deriving their own notion of its shape. Add new
 * widget types by injecting them here and registering them in `values`; an unregistered type
 * falls back to `UnSupportWidgetValue` (string coercion), same as the pre-refactor
 * `DisplayMapperFactory`.
 */
@Injectable()
export class WidgetValueFactory {
  private readonly values: Partial<Record<string, WidgetValueInterface>>;

  constructor(
    select: SelectWidgetValue,
    checkbox: CheckboxWidgetValue,
    radio: RadioWidgetValue,
    users: UsersWidgetValue,
    submittedBy: SubmittedByWidgetValue,
    date: DateWidgetValue,
    datetime: DatetimeWidgetValue,
    time: TimeWidgetValue,
    createdAt: CreatedAtWidgetValue,
    text: TextWidgetValue,
    textArea: TextAreaWidgetValue,
    private readonly unSupportValue: UnSupportWidgetValue,
  ) {
    this.values = {
      [WIDGET_TYPE.SELECT]: select,
      [WIDGET_TYPE.CHECKBOX]: checkbox,
      [WIDGET_TYPE.RADIO]: radio,
      [WIDGET_TYPE.USERS]: users,
      [WIDGET_TYPE.SUBMITTED_BY]: submittedBy,
      [WIDGET_TYPE.DATE]: date,
      [WIDGET_TYPE.DATETIME]: datetime,
      [WIDGET_TYPE.TIME]: time,
      [WIDGET_TYPE.CREATED_AT]: createdAt,
      [WIDGET_TYPE.TEXT]: text,
      [WIDGET_TYPE.TEXT_AREA]: textArea,
    };
  }

  getValue(widgetType: string): WidgetValueInterface {
    return this.values[widgetType] ?? this.unSupportValue;
  }
}
