import type { Widget } from "@/template/template.types";
import type { ValueMap } from "./widget-value.types";

/** The slice of a submission a `MappingContext` reads raw values from - just its current values, keyed by widget id. */
export interface MappingSource {
  data: Record<string, unknown>;
  meta: {
    createdAt: Date;
  };
  /** The widgets whose values get mapped - the template snapshot's widgets, not the submission's data keys, so every widget gets an entry. */
  widgets: readonly Widget[];
  /** User uuid -> name, for the widgets that reference users; omitted when the template has none, or when it is set later through `MappingContext.setUsers`. */
  users?: ReadonlyMap<string, string>;
}

/**
 * Threaded through `WidgetValueInterface.map()`: gives each widget-value class read access to
 * its own raw submitted value (`getRaw`) and a place to write its resolved value-properties
 * (`setMapped`), so no implementation needs to know the doc's `{ [widgetId]: { [valueType]: ... } }`
 * nesting itself - that's `MappingContext`'s job alone.
 */
export class MappingContext {
  private readonly doc: Record<string, Record<string, ValueMap>> = {};

  private users: ReadonlyMap<string, string>;

  constructor(private readonly source: MappingSource) {
    this.users = source.users ?? new Map();
  }

  getRaw(widgetId: string): unknown {
    return this.source.data[widgetId];
  }

  setMapped(widget: Widget, mapped: Record<string, ValueMap>): void {
    this.doc[widget.id] = mapped;
  }

  getDoc(): Record<string, Record<string, ValueMap>> {
    return this.doc;
  }

  /** Replaces the users the context resolves user references against (filled in after construction by `MappingContextLoader`). */
  setUsers(users: ReadonlyMap<string, string>): void {
    this.users = users;
  }

  getUsers(): ReadonlyMap<string, string> {
    return this.users;
  }

  getWidgets(): readonly Widget[] {
    return this.source.widgets;
  }

  getMeta() {
    return this.source.meta;
  }
}
