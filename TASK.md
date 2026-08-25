# Minimize data redundancy

## Currently

- The session include session-properties
- The widget include widget-properties
- I realize that properties should really be part of the entity itself.

## Tasks

- [x] Merge `sessionProperties` into `session` (single `sessions` map, `Session` gains `SessionProperties` fields; `sessionProperties` removed)
- [x] Merge `properties` into `widgets` (single `widgets` map, `Widget` gains `WidgetProperties` fields; `properties` map removed)
- [x] Remove hook related properties (state hooks like `useWidgetState`/`useSessionState` stop returning a separate `properties` field now that it's merged into the entity; `useWidgetState` itself was removed since it became a redundant passthrough)
- [x] If a component accept a properties -> change to accept entity
- [x] Update for [website][server][yjs-server]

## Rules

- Don't migration, remove all record in database
