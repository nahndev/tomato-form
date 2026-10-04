import { Module } from "@nestjs/common";
import { ChoiceValue } from "./values/choice.value";
import { DateTimeValue, DateValue, TimeValue } from "./values/date.value";
import { EntityValue } from "./values/entity.value";
import { TextValue } from "./values/text.value";
import { UserValue } from "./values/user.value";
import { WidgetValueFactory } from "./widget-value.factory";
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

const VALUE_PROVIDERS = [
  EntityValue,
  TextValue,
  ChoiceValue,
  UserValue,
  DateValue,
  TimeValue,
  DateTimeValue,
];

const WIDGET_VALUE_PROVIDERS = [
  SelectWidgetValue,
  CheckboxWidgetValue,
  RadioWidgetValue,
  UsersWidgetValue,
  SubmittedByWidgetValue,
  DateWidgetValue,
  DatetimeWidgetValue,
  TimeWidgetValue,
  CreatedAtWidgetValue,
  TextWidgetValue,
  TextAreaWidgetValue,
  UnSupportWidgetValue,
];

@Module({
  providers: [
    ...VALUE_PROVIDERS,
    ...WIDGET_VALUE_PROVIDERS,
    WidgetValueFactory,
  ],
  exports: [WidgetValueFactory],
})
export class WidgetValueModule {}
