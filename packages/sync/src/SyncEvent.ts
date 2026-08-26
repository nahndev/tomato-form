/**
 * Base class every domain event must extend. `emit`/`on` on `SyncDoc` key
 * listeners off the event's constructor, so subclassing (not just shaping)
 * is what makes an event routable.
 */
export abstract class SyncEvent {}

export type EventConstructor<T extends SyncEvent = SyncEvent> = new (
  ...args: never[]
) => T;
