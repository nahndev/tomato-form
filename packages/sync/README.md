# @tomato/sync

## Overview

`@tomato/sync` wraps a [Yjs](https://docs.yjs.dev/) `Y.Doc` (a CRDT - a
data structure designed to merge concurrent edits without conflicts) with a
small, typed reactive layer, so features built on it don't have to
hand-coordinate every cross-entity side effect at the call site.

It exists because implementing this directly against `Y.Doc` tends to grow
into a lot of manual, order-dependent code: deleting a session means walking
into the widgets map yourself, into every other map that references that
session, and hoping you didn't miss one. `@tomato/sync` replaces that with
small **Handler** classes that own one slice of the doc's schema and react to
each other through typed **events**, instead of reaching into each other's
data directly.

The design borrows two ideas:

- **Doctrine's `EntityListener`** - a class that reacts to lifecycle events on
  an entity, without the entity needing to know who's listening.
- **NestJS-style lifecycle hooks** - `OnSynced`/`OnDestroy`, decorators as the
  registration mechanism, and `synced()`/`destroy()` as an explicit phase the
  app triggers separately from registration - not something that fires the
  instant a Handler is registered.

---

## Core Concepts

| Concept       | What it is                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| `SyncDoc`     | Wraps one `Y.Doc`. Holds a registry of Handlers and a typed event pub/sub. No business logic itself. |
| Handler       | A plain class, `@SyncHandler()`-decorated, that owns one part of the schema (its own `Y.Map`/`Y.Text` getters) plus the actions that mutate it. |
| `SyncEvent`   | Base class for domain events. Each event is its own subclass with typed, named properties - not a JSON object. |
| `@OnSyncEvent(Event)`| Method decorator - runs the method whenever a `SyncDoc` emits an instance of `Event`. The method's parameter is typed as that event class. |
| `@SyncHandler()` | Class decorator - marks a class as registrable. `registerHandler` throws immediately if it's missing, instead of silently wiring up nothing. |
| `OnSynced`/`OnDestroy` | Optional interfaces a Handler implements for post-sync/teardown logic. `syncDoc.synced()`/`.destroy()` run `onSynced()`/`onDestroy()` on every registered Handler that implements them - the app decides when, separately from registration. |

A Handler method that changes data calls `this.syncDoc.emit(...)` itself to
describe what happened; it never opens a transaction itself. Opening
`doc.transact(...)` is done in exactly one place: the `useTransaction()`
hook, which just wraps the callback - it doesn't know or care what gets
emitted inside it. This keeps every transaction flat - a reaction triggered
by `emit` mutates maps directly, it can't nest another transaction inside the
one that triggered it.

---

## Usage

```ts
import { SyncDoc, SyncEvent, SyncHandler, OnSyncEvent } from "@tomato/sync";

class WidgetAddedEvent extends SyncEvent {
  constructor(readonly widgetId: string) {
    super();
  }
}

@SyncHandler()
class WidgetHandler {
  constructor(private readonly syncDoc: SyncDoc) {}

  private get widgets() {
    return this.syncDoc.doc.getMap<string>("widgets");
  }

  addWidget(id: string): void {
    this.widgets.set(id, id);
    this.syncDoc.emit(new WidgetAddedEvent(id));
  }
}

@SyncHandler()
class SessionHandler {
  constructor(private readonly syncDoc: SyncDoc) {}

  @OnSyncEvent(WidgetAddedEvent)
  onWidgetAdded(event: WidgetAddedEvent) {
    // react to the new widget without WidgetHandler knowing this exists
  }
}

const syncDoc = new SyncDoc();
syncDoc.registerHandler(new WidgetHandler(syncDoc));
syncDoc.registerHandler(new SessionHandler(syncDoc));
```

In React:

```tsx
import { SyncDocProvider, useHandler, useTransaction } from "@tomato/sync";

function useWidgetActions() {
  const widgetHandler = useHandler(WidgetHandler);
  const transact = useTransaction();

  return {
    addWidget: (id: string) => transact(() => widgetHandler.addWidget(id)),
  };
}
```

`SyncDocProvider` only provides an already-constructed `SyncDoc` - owning its
lifecycle (creating it, wiring a realtime provider such as Hocuspocus,
calling `registerHandler` for each Handler, calling `.destroy()` on unmount)
is the app's responsibility, not this package's.

---

## Requirements

- `@OnSyncEvent`/`@SyncHandler` are TypeScript legacy decorators - the
  consuming project's `tsconfig.json` needs `"experimentalDecorators": true`.
- `reflect-metadata` is imported as a side effect of this package's entry
  point, so consumers don't need to import it themselves.

## Design Notes / Trade-offs

- Subscription keys are event **classes**, not strings, so `@OnSyncEvent`/
  `emit` are type-checked end to end. This is why the package doesn't use a
  string-keyed emitter library (e.g. `mitt`) internally - the pub/sub here is
  a small `Map<EventClass, Set<listener>>` instead.
- `registerHandler` throws on a duplicate registration of the same class
  rather than silently overwriting it, since overwriting would leave the
  previous instance's listeners registered without ever being cleaned up.

---

## Commands

```bash
# From this package
pnpm typecheck
pnpm lint
```
