import { WidgetItems } from "@/features/template/constants/widget/widgetItems";
import { DEFAULT_LAYOUT } from "@/features/template/hooks/internal/templateStateReader";
import type { GridLayout } from "@/types/template";
import { OnSyncEvent, SyncDoc, SyncHandler } from "@tomato/sync";
import { LayoutIdx } from "@tomato/grid";
import { LayoutUpdatedEvent, WidgetAddedEvent, WidgetRemovedEvent } from "../events";
import { SessionHandler } from "./SessionHandler";

/**
 * Owns `layouts` + `widgetToSession`. Placement for a new widget and cleanup
 * for a removed one used to be hand-coordinated inside `useWidgetActions` -
 * here it's this Handler reacting to `WidgetAddedEvent`/`WidgetRemovedEvent`
 * instead, so `WidgetHandler` doesn't need to know layouts/sessions exist.
 */
@SyncHandler()
export class LayoutHandler {
  constructor(private readonly syncDoc: SyncDoc) {}

  private get layouts() {
    return this.syncDoc.doc.getMap<GridLayout>("layouts");
  }

  private get widgetToSession() {
    return this.syncDoc.doc.getMap<string>("widgetToSession");
  }

  getLayout(widgetId: string): GridLayout | undefined {
    return this.layouts.get(widgetId);
  }

  setLayout(widgetId: string, sessionId: string, patch: Partial<GridLayout>): void {
    const current = this.layouts.get(widgetId) ?? DEFAULT_LAYOUT;
    this.layouts.set(widgetId, { ...current, ...patch });
    this.widgetToSession.set(widgetId, sessionId);
    this.syncDoc.emit(new LayoutUpdatedEvent(widgetId, sessionId));
  }

  @OnSyncEvent(WidgetAddedEvent)
  onWidgetAdded(event: WidgetAddedEvent): void {
    const { widget, before } = event;
    const def = WidgetItems[widget.type];
    const layout: GridLayout = {
      ...def.defaultLayout,
      idx: LayoutIdx.getInsertIdx(
        Object.fromEntries(this.layouts.entries()),
        before,
      ),
    };
    this.layouts.set(widget.id, layout);

    const beforeSessionId = before && this.widgetToSession.get(before.id);
    const sessionId =
      beforeSessionId ??
      this.syncDoc.getHandler(SessionHandler).getOrCreateDefaultSessionId();
    this.widgetToSession.set(widget.id, sessionId);
  }

  @OnSyncEvent(WidgetRemovedEvent)
  onWidgetRemoved(event: WidgetRemovedEvent): void {
    this.layouts.delete(event.widgetId);
    this.widgetToSession.delete(event.widgetId);
  }
}
