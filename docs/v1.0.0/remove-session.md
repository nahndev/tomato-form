# Add button allow remove session

## Currently

- `SessionHandler` (`website/src/features/template/sync/handlers/SessionHandler.ts`) only exposes `addSession` and `updateSession` - there is no `removeSession`.
- `useSessionActions` (`website/src/features/template/sync/hooks/useSessionActions.ts`) mirrors that - no `removeSession` action exposed to components.
- `SessionCreation.tsx` only renders an "Add Session" button.
- `SessionSettingPopup.tsx` (opened from `SessionHeader.tsx`) is the only per-session settings surface today, and only manages the visibility `condition` - no destructive action.
- Deleting a widget already has a cascade pattern to follow: `WidgetHandler.removeWidget` emits `WidgetRemovedEvent`, which `LayoutHandler` listens to and cleans up `layouts`/`widgetToSession` for that widget.

## Acceptance Criteria

- [x] A session can be removed from its settings popup (`SessionSettingPopup`), as a destructive action with a confirmation step
- [x] Removing a session removes all widgets that belong to it (via `widgetToSession`), not just the session entry itself
- [x] The last remaining session cannot be removed (a template must always have at least one session)
- [x] Removing the currently-active/selected session falls back to another existing session so the canvas doesn't point at a deleted session

## Solutions

- [x] Add `SessionHandler.removeSession(sessionId)` - delete from the `sessions` map and emit a new `SessionRemovedEvent`
- [x] Add `SessionRemovedEvent` to `website/src/features/template/sync/events.ts`
- [x] Cascade-delete widgets owned by the removed session (reuse/extend the `WidgetRemovedEvent`/`LayoutHandler` cleanup pattern) so `widgets`, `layouts`, and `widgetToSession` stay consistent
- [x] Expose `removeSession` from `useSessionActions`
- [x] Add a "Remove session" button in `SessionSettingPopup.tsx`, disabled when it's the only session, guarded by a confirmation dialog
- [x] Handle redirect of the active session selection when the removed session was selected (`TemplateCanvas.tsx`)

## Changelogs

- Added `SessionRemovedEvent` (`website/src/features/template/sync/events.ts`).
- Added `SessionHandler.removeSession(sessionId)` (`website/src/features/template/sync/handlers/SessionHandler.ts`): no-ops if the session doesn't exist or is the last remaining one, otherwise looks up the session's widgets via the new `LayoutHandler.getWidgetIdsForSession` and removes each through the existing `WidgetHandler.removeWidget` (which already emits `WidgetRemovedEvent`, cleaned up by `LayoutHandler.onWidgetRemoved`), then deletes the session and emits `SessionRemovedEvent`.
- Added `LayoutHandler.getWidgetIdsForSession(sessionId)` to query `widgetToSession` for a session's widget ids.
- Exposed `removeSession` from `useSessionActions`.
- Added a shadcn-style `AlertDialog` component (`website/src/components/ui/alert-dialog.tsx`, built from the already-installed `radix-ui` package's `AlertDialog` primitive - the `shadcn` CLI's `add alert-dialog` failed against this repo's registry config, so it was hand-written to match `dialog.tsx`'s existing conventions).
- Added a "Remove session" destructive button + confirmation `AlertDialog` to `SessionSettingPopup.tsx`, disabled when it's the only session.
- `TemplateCanvas.tsx` needed no change: it already renders every session unconditionally (`Object.values(sessions).map(...)`) rather than tracking a single "active" session id, so there's no dangling pointer to redirect - the removed session's `SessionBox` simply stops rendering. Widget selection (`useWidgetSelection`, `hooks/useSelection.ts`) already self-heals the same way: `selected` is derived via `list.find(...)`, so a selected widget deleted by the cascade just resolves to `null` on the next render.
- Tests: `SessionHandler.test.ts` (removal, cascade, last-session guard, event emission) and `SessionSettingPopup.test.tsx` (disabled state, confirm/cancel flow). Added `getMockSession` to `template.factory.ts`.
