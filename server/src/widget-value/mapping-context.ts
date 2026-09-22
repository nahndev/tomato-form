import type { Widget } from "@/template/template.types";
import type { ValueMap } from "./widget-value.types";

/** The slice of a submission a `MappingContext` reads raw values from - just its current values, keyed by widget id. */
export interface MappingSource {
  data: Record<string, unknown>;
  meta: {
    createdAt: Date;
  };
}

/**
 * Threaded through `WidgetValueInterface.map()`: gives each widget-value class read access to
 * its own raw submitted value (`getRaw`) and a place to write its resolved value-properties
 * (`setMapped`), so no implementation needs to know the doc's `{ [widgetId]: { [valueType]: ... } }`
 * nesting itself - that's `MappingContext`'s job alone.
 */
export class MappingContext {
  private readonly doc: Record<string, Record<string, ValueMap>> = {};

  constructor(private readonly source: MappingSource) {}

  getRaw(widgetId: string): unknown {
    return this.source.data[widgetId];
  }

  setMapped(widget: Widget, mapped: Record<string, ValueMap>): void {
    this.doc[widget.id] = mapped;
  }

  getDoc(): Record<string, Record<string, ValueMap>> {
    return this.doc;
  }

  getMeta() {
    return this.source.meta;
  }
}
