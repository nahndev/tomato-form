import { createContext, useCallback, useContext, useEffect } from "react";
import { SyncDoc } from "./SyncDoc";
import type { SyncEvent, EventConstructor } from "./SyncEvent";

const SyncDocContext = createContext<SyncDoc | null>(null);

/** App owns the `SyncDoc` lifecycle (yjs/network wiring); this just hands it down. */
export const SyncDocProvider = SyncDocContext.Provider;

export function useSyncDoc(): SyncDoc {
  const syncDoc = useContext(SyncDocContext);
  if (!syncDoc) {
    throw new Error("This hook must be used inside <SyncDocProvider>");
  }
  return syncDoc;
}

/** Returns the previously `registerHandler`-ed instance of `ctor`. */
export function useHandler<T extends object>(
  ctor: new (...args: never[]) => T,
): T {
  const syncDoc = useSyncDoc();
  return syncDoc.getHandler(ctor);
}

/**
 * The only place allowed to open a `doc.transact(...)`. Handler methods
 * mutate maps and call `this.syncDoc.emit(...)` themselves as they go - this
 * hook just opens the transaction around them, it never emits on their
 * behalf. Handler methods never transact themselves, so an `emit` triggered
 * reaction can't nest a second transaction inside this one.
 */
export function useTransaction() {
  const syncDoc = useSyncDoc();
  return useCallback(
    (callback: () => void) => {
      syncDoc.doc.transact(callback);
    },
    [syncDoc],
  );
}

/** For a component (not a Handler) that wants to react to one event type directly. */
export function useSyncEvent<T extends SyncEvent>(
  eventType: EventConstructor<T>,
  callback: (event: T) => void,
): void {
  const syncDoc = useSyncDoc();
  useEffect(
    () => syncDoc.on(eventType, callback),
    [syncDoc, eventType, callback],
  );
}
