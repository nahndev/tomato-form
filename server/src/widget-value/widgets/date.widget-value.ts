import type { Widget } from "@/template/template.types";
import type { MappingContext } from "../mapping-context";
import { DateTimeValue, DateValue, TimeValue } from "../values/date.value";
import {
  DateValueInterface,
  TimeValueInterface,
  VALUE_TYPE,
  ValueInterface,
  WidgetValueInterface,
} from "../widget-value.types";

/** `date`/`time`/`created-at`: a single `default` property, value is an epoch-ms timestamp. Subclasses only differ in which `ValueInterface` formats that property's fallback text. */
abstract class BaseDateWidgetValue implements WidgetValueInterface {
  protected abstract readonly value: ValueInterface;

  validate(value: unknown): boolean {
    return value === null || value === undefined || typeof value === "number";
  }

  map(context: MappingContext, widget: Widget): void {
    const raw = context.getRaw(widget.id);
    context.setMapped(widget, { [VALUE_TYPE.DEFAULT]: this.value.getMapped(raw) });
  }
}

export class DateWidgetValue extends BaseDateWidgetValue {
  protected readonly value = new DateValue();
}

export class TimeWidgetValue extends BaseDateWidgetValue {
  protected readonly value = new TimeValue();
}

export class CreatedAtWidgetValue extends BaseDateWidgetValue {
  protected readonly value = new DateValue();
}

/** The only widget with more than one value-property: exposes `default` (full date+time), `date`, and `time`, all resolved from the same raw epoch-ms value but formatted by their own `ValueInterface`. */
export class DatetimeWidgetValue
  extends BaseDateWidgetValue
  implements DateValueInterface, TimeValueInterface
{
  protected readonly value = new DateTimeValue();
  private readonly dateValue = new DateValue();
  private readonly timeValue = new TimeValue();

  getDateValue(): ValueInterface {
    return this.dateValue;
  }

  getTimeValue(): ValueInterface {
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
