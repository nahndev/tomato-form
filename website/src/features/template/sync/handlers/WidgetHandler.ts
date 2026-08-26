import { WidgetItems } from "@/features/template/constants/widget/widgetItems";
import type { Widget, WidgetProperties } from "@/types/template";
import type { WidgetType } from "@/types/widget";
import { SyncDoc, SyncHandler } from "@tomato/sync";
import {
  WidgetAddedEvent,
  WidgetPropertyChangedEvent,
  WidgetRemovedEvent,
} from "../events";

/** Owns the `widgets` map. Actions only mutate `widgets` - session/layout placement is `LayoutHandler`'s reaction to `WidgetAddedEvent`/`WidgetRemovedEvent`. */
@SyncHandler()
export class WidgetHandler {
  constructor(private readonly syncDoc: SyncDoc) {}

  private get widgets() {
    return this.syncDoc.doc.getMap<Widget>("widgets");
  }

  getWidget(id: string): Widget | undefined {
    return this.widgets.get(id);
  }

  addWidget(id: Widget["id"], type: WidgetType, before: Widget | null): void {
    const def = WidgetItems[type];
    const widget: Widget = { id, type, ...def.defaultSettings };
    this.widgets.set(id, widget);
    this.syncDoc.emit(new WidgetAddedEvent(widget, before));
  }

  removeWidget(widgetId: string): void {
    if (!this.widgets.has(widgetId)) return;
    this.widgets.delete(widgetId);
    this.syncDoc.emit(new WidgetRemovedEvent(widgetId));
  }

  setProperty<K extends keyof WidgetProperties>(
    widgetId: string,
    key: K,
    value: WidgetProperties[K],
  ): void {
    const current = this.widgets.get(widgetId);
    if (!current) return;
    const widget = { ...current, [key]: value };
    this.widgets.set(widgetId, widget);
    this.syncDoc.emit(new WidgetPropertyChangedEvent(widget, key));
  }
}
