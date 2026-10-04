import type { Widget } from "@/template/template.types";
import { Injectable } from "@nestjs/common";
import type { MappingContext } from "../mapping-context";
import {
  BaseDateValue,
  DateTimeValue,
  DateValue,
  TimeValue,
} from "../values/date.value";
import {
  DateValueInterface,
  TimeValueInterface,
  VALUE_TYPE,
  WidgetValueInterface,
} from "../widget-value.types";

/** `date`/`time`/`created-at`: a single `default` property, value is an epoch-ms timestamp. Subclasses only differ in which date value class (injected) formats that property's fallback text. */
abstract class BaseDateWidgetValue implements WidgetValueInterface {
  constructor(protected readonly value: BaseDateValue) {}

  validate(value: unknown): boolean {
    return value === null || value === undefined || typeof value === "number";
  }

  map(context: MappingContext, widget: Widget): void {
    const raw = context.getRaw(widget.id);
    context.setMapped(widget, {
      [VALUE_TYPE.DEFAULT]: this.value.getMapped(raw),
    });
  }
}

@Injectable()
export class DateWidgetValue extends BaseDateWidgetValue {
  constructor(value: DateValue) {
    super(value);
  }
}

@Injectable()
export class TimeWidgetValue extends BaseDateWidgetValue {
  constructor(value: TimeValue) {
    super(value);
  }
}

@Injectable()
export class CreatedAtWidgetValue extends BaseDateWidgetValue {
  constructor(value: DateValue) {
    super(value);
  }

  map(context: MappingContext, widget: Widget): void {
    const raw = context.getMeta().createdAt.getTime();
    context.setMapped(widget, {
      [VALUE_TYPE.DEFAULT]: this.value.getMapped(raw),
    });
  }
}

/** The only widget with more than one value-property: exposes `default` (full date+time), `date`, and `time`, all resolved from the same raw epoch-ms value but formatted by their own value class. */
@Injectable()
export class DatetimeWidgetValue
  extends BaseDateWidgetValue
  implements DateValueInterface, TimeValueInterface
{
  constructor(
    value: DateTimeValue,
    private readonly dateValue: DateValue,
    private readonly timeValue: TimeValue,
  ) {
    super(value);
  }

  getDateValue(): DateValue {
    return this.dateValue;
  }

  getTimeValue(): TimeValue {
    return this.timeValue;
  }

  map(context: MappingContext, widget: Widget): void {
    const raw = context.getRaw(widget.id);
    context.setMapped(widget, {
      [VALUE_TYPE.DEFAULT]: this.value.getMapped(raw),
      [VALUE_TYPE.DATE]: this.getDateValue().getMapped(raw),
      [VALUE_TYPE.TIME]: this.getTimeValue().getMapped(raw),
    });
  }
}
