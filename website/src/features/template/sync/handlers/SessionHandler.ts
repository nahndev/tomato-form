import type { Session, SessionProperties } from "@/types/template";
import { SyncDoc, SyncHandler } from "@tomato/sync";
import {
  SessionAddedEvent,
  SessionRemovedEvent,
  SessionUpdatedEvent,
} from "../events";
import { LayoutHandler } from "./LayoutHandler";
import { WidgetHandler } from "./WidgetHandler";

const DEFAULT_SESSION_ID = "default-session";
const DEFAULT_SESSION_NAME = "Section 1";

/** Owns the `sessions` map. */
@SyncHandler()
export class SessionHandler {
  constructor(private readonly syncDoc: SyncDoc) {}

  private get sessions() {
    return this.syncDoc.doc.getMap<Session>("sessions");
  }

  getSession(id: string): Session | undefined {
    return this.sessions.get(id);
  }

  /**
   * Not wrapped in its own transaction/event - called from
   * `LayoutHandler.onWidgetAdded`, which already runs inside the outer
   * transaction opened by `useTransaction()`.
   */
  getOrCreateDefaultSessionId(): string {
    const existing = this.sessions.values().next().value as Session | undefined;
    if (existing) return existing.id;
    this.sessions.set(DEFAULT_SESSION_ID, {
      id: DEFAULT_SESSION_ID,
      name: DEFAULT_SESSION_NAME,
    });
    return DEFAULT_SESSION_ID;
  }

  addSession(id: string, properties: SessionProperties): void {
    const session: Session = { id, ...properties };
    this.sessions.set(id, session);
    this.syncDoc.emit(new SessionAddedEvent(session));
  }

  updateSession(sessionId: string, patch: Partial<SessionProperties>): void {
    const current = this.sessions.get(sessionId);
    if (!current) return;
    this.sessions.set(sessionId, { ...current, ...patch });
    this.syncDoc.emit(new SessionUpdatedEvent(sessionId));
  }

  /**
   * A template must always have at least one session, so removing the last
   * one is a no-op rather than an error - mirrors how `updateSession` above
   * silently no-ops on a missing id.
   */
  removeSession(sessionId: string): void {
    if (!this.sessions.has(sessionId)) return;
    if (this.sessions.size <= 1) return;

    const widgetHandler = this.syncDoc.getHandler(WidgetHandler);
    this.syncDoc
      .getHandler(LayoutHandler)
      .getWidgetIdsForSession(sessionId)
      .forEach((widgetId) => widgetHandler.removeWidget(widgetId));

    this.sessions.delete(sessionId);
    this.syncDoc.emit(new SessionRemovedEvent(sessionId));
  }
}
