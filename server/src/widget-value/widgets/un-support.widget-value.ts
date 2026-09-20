import type { Widget } from "@/template/template.types";
import type { MappingContext } from "../mapping-context";
import { TextValue } from "../values/text.value";
import { VALUE_TYPE, WidgetValueInterface } from "../widget-value.types";

/** Fallback for widget types with no registered value contract yet - same string coercion as `TextWidgetValue`, kept as its own class so the factory's fallback path stays explicit. Accepts any value (nothing to validate against). */
export class UnSupportWidgetValue implements WidgetValueInterface {
  private readonly value = new TextValue();

  validate(): boolean {
    return true;
  }

  map(context: MappingContext, widget: Widget): void {
    const raw = context.getRaw(widget.id);
    context.setMapped(widget, { [VALUE_TYPE.DEFAULT]: this.value.getMapped(raw) });
  }
}
