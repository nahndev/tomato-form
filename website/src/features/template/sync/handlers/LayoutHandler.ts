import { WidgetItems } from "@/features/template/constants/widget/widgetItems";
import { DEFAULT_LAYOUT } from "@/features/template/hooks/internal/templateStateReader";
import type { GridLayout } from "@/types/template";
import { OnSyncEvent, SyncDoc, SyncHandler } from "@tomato/sync";
import { LayoutIdx } from "@tomato/grid";
import { generateKeyBetween } from "fractional-indexing";
import { LayoutUpdatedEvent, WidgetAddedEvent, WidgetRemovedEvent } from "../events";
import { SessionHandler } from "./SessionHandler";

/** Where a widget goes in the order: the start, the end, or right after another widget. */
export type WidgetPosition = "first" | "last" | { after: string };

export interface WidgetPlacement {
  /** Grid fields to change; the others are kept. */
  layout?: Partial<Pick<GridLayout, "column" | "span" | "isFullWidth">>;
  /** Session to move the widget to; omitted keeps its session. */
  sessionId?: string;
  /** Omitted keeps the widget's place in the order. */
  position?: WidgetPosition;
}

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

  getSessionId(widgetId: string): string | undefined {
    return this.widgetToSession.get(widgetId);
  }

  getWidgetIdsForSession(sessionId: string): string[] {
    return Array.from(this.widgetToSession.entries())
      .filter(([, sid]) => sid === sessionId)
      .map(([widgetId]) => widgetId);
  }

  setLayout(widgetId: string, sessionId: string, patch: Partial<GridLayout>): void {
    const current = this.layouts.get(widgetId) ?? DEFAULT_LAYOUT;
    this.layouts.set(widgetId, { ...current, ...patch });
    this.widgetToSession.set(widgetId, sessionId);
    this.syncDoc.emit(new LayoutUpdatedEvent(widgetId, sessionId));
  }

  /** Moves and/or resizes an existing widget in one write. No-op for a widget without a layout. */
  placeWidget(widgetId: string, placement: WidgetPlacement): void {
    const current = this.layouts.get(widgetId);
    const currentSessionId = this.widgetToSession.get(widgetId);
    if (!current || !currentSessionId) return;

    const sessionId = placement.sessionId ?? currentSessionId;
    const idx = placement.position
      ? this.getIdxAt(widgetId, placement.position)
      : current.idx;
    this.layouts.set(widgetId, { ...current, ...placement.layout, idx });
    this.widgetToSession.set(widgetId, sessionId);
    this.syncDoc.emit(new LayoutUpdatedEvent(widgetId, sessionId));
  }

  /** The idx for `widgetId` at `position`, computed among the other widgets. */
  private getIdxAt(widgetId: string, position: WidgetPosition): string {
    const others = Object.fromEntries(
      Array.from(this.layouts.entries()).filter(([id]) => id !== widgetId),
    );
    if (position === "first") {
      const firstIdx = Object.values(others)
        .map((layout) => layout.idx)
        .sort()[0];
      return generateKeyBetween(null, firstIdx ?? null);
    }
    if (position === "last") return LayoutIdx.getInsertIdx(others, null);
    return LayoutIdx.getInsertIdx(others, { id: position.after });
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
