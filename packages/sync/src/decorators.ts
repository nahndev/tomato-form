import "reflect-metadata";
import type { SyncEvent, EventConstructor } from "./SyncEvent";

const ON_SYNC_EVENT_METADATA_KEY = Symbol("sync:onSyncEvent");
const SYNC_HANDLER_METADATA_KEY = Symbol("sync:handler");

export interface OnSyncEventMeta {
  eventType: EventConstructor;
  methodName: string | symbol;
}

/**
 * Method decorator - registers `methodName` to run whenever a `SyncDoc`
 * emits an instance of `eventType`. Takes the event class itself (not a
 * string key), so the handler's parameter type is checked against the real
 * event shape instead of being typed by hand.
 */
export function OnSyncEvent<T extends SyncEvent>(eventType: EventConstructor<T>) {
  return function (target: object, methodName: string | symbol) {
    const existing: OnSyncEventMeta[] =
      Reflect.getMetadata(ON_SYNC_EVENT_METADATA_KEY, target.constructor) ?? [];
    existing.push({ eventType, methodName });
    Reflect.defineMetadata(ON_SYNC_EVENT_METADATA_KEY, existing, target.constructor);
  };
}

export function getOnSyncEventMetadata(handler: object): OnSyncEventMeta[] {
  return Reflect.getMetadata(ON_SYNC_EVENT_METADATA_KEY, handler.constructor) ?? [];
}

/**
 * Class decorator - marks a class as a valid `SyncDoc` handler. Separate
 * from `@OnSyncEvent` (method-level, picks which method runs for which
 * event): `@SyncHandler()` is what `registerHandler` checks for, so a class
 * that forgot it fails loudly at registration instead of silently never
 * firing.
 */
export function SyncHandler(): ClassDecorator {
  return function (target: object) {
    Reflect.defineMetadata(SYNC_HANDLER_METADATA_KEY, true, target);
  };
}

export function isSyncHandler(ctor: object): boolean {
  return Reflect.getMetadata(SYNC_HANDLER_METADATA_KEY, ctor) === true;
}
