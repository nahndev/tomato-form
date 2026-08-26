import * as Y from "yjs";
import type { SyncEvent, EventConstructor } from "./SyncEvent";
import { getOnSyncEventMetadata, isSyncHandler } from "./decorators";
import { isOnDestroy, isOnSynced } from "./types";

/**
 * Wraps a `Y.Doc` with a typed pub/sub for domain events plus a registry of
 * "Handler" instances (business logic + reactions, see `@SyncHandler`/`@OnSyncEvent`).
 * Deliberately has no `transact()` of its own - opening a transaction and
 * emitting the events it produces is a React-layer concern (`useTransaction`
 * in `./react`), so a Handler method can never nest a transaction inside
 * another by calling it from a reaction.
 */
export class SyncDoc {
  readonly doc: Y.Doc;
  private readonly listeners = new Map<
    EventConstructor,
    Set<(event: SyncEvent) => void>
  >();
  private readonly instances = new Map<Function, object>();
  private readonly unregisterFns: Array<() => void> = [];

  constructor() {
    this.doc = new Y.Doc();
  }

  on<T extends SyncEvent>(
    eventType: EventConstructor<T>,
    listener: (event: T) => void,
  ): () => void {
    const set = this.listeners.get(eventType) ?? new Set();
    set.add(listener as (event: SyncEvent) => void);
    this.listeners.set(eventType, set);
    return () => set.delete(listener as (event: SyncEvent) => void);
  }

  emit(event: SyncEvent): void {
    this.listeners
      .get(event.constructor as EventConstructor)
      ?.forEach((listener) => listener(event));
  }

  registerHandler<T extends object>(handler: T): T {
    if (!isSyncHandler(handler.constructor)) {
      throw new Error(
        `"${handler.constructor.name}" thiếu @SyncHandler() - không thể đăng ký vào SyncDoc`,
      );
    }
    if (this.instances.has(handler.constructor)) {
      throw new Error(`Handler "${handler.constructor.name}" đã được đăng ký`);
    }
    this.instances.set(handler.constructor, handler);

    getOnSyncEventMetadata(handler).forEach(({ eventType, methodName }) => {
      const off = this.on(eventType, (event) => {
        try {
          (handler as Record<string, (e: SyncEvent) => void>)[
            methodName as string
          ](event);
        } catch (error) {
          console.error(
            `[${handler.constructor.name}] lỗi khi xử lý "${eventType.name}"`,
            error,
          );
        }
      });
      this.unregisterFns.push(off);
    });

    return handler;
  }

  getHandler<T extends object>(ctor: new (...args: never[]) => T): T {
    const found = this.instances.get(ctor);
    if (!found) {
      throw new Error(`Handler "${ctor.name}" chưa được đăng ký vào SyncDoc`);
    }
    return found as T;
  }

  /**
   * Runs `onSynced()` on every registered Handler that implements it - a
   * separate, explicit phase from `registerHandler`, so the app calls this
   * exactly when it knows the doc has actually synced with a realtime
   * provider, instead of startup logic firing the instant a Handler is
   * registered (typically well before any sync has happened). Safe to call
   * more than once - re-running `onSynced()` on a Handler whose own logic is
   * already idempotent (e.g. guarded by a "ready" flag) is a no-op.
   */
  synced(): void {
    this.instances.forEach((handler) => {
      if (isOnSynced(handler)) handler.onSynced();
    });
  }

  destroy(): void {
    this.instances.forEach((handler) => {
      if (isOnDestroy(handler)) handler.onDestroy();
    });
    this.unregisterFns.forEach((fn) => fn());
    this.doc.destroy();
  }
}
