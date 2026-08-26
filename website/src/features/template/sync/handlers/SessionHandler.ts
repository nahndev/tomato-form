import type { Session, SessionProperties } from "@/types/template";
import { SyncDoc, SyncHandler } from "@tomato/sync";
import { SessionAddedEvent, SessionUpdatedEvent } from "../events";

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
    const existing = this.sessions.values().next().value as
      | Session
      | undefined;
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
}
