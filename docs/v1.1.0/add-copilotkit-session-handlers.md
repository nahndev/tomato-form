# Add CopilotKit for session handlers

## Currently

- A template is a list of sessions (wizard steps) holding widgets. Sessions are owned by `SessionHandler` ([website/src/features/template/sync/handlers/SessionHandler.ts](../../website/src/features/template/sync/handlers/SessionHandler.ts)), and the builder mutates them through `useSessionActions` ([website/src/features/template/sync/hooks/useSessionActions.ts](../../website/src/features/template/sync/hooks/useSessionActions.ts)): `addSession`, `updateSession`, `removeSession`, `updateLayout` and `placeWidget`. A session has `name`, `icon`, `description` and `condition` (`SessionProperties` in `website/src/types/template.ts`).
- The copilot is mounted by `TemplateCopilot` ([website/src/features/template/sync/copilot/TemplateCopilot.tsx](../../website/src/features/template/sync/copilot/TemplateCopilot.tsx)), edit mode only.
- What the copilot can currently see about sessions: `TemplateCopilotContext` registers the template's sessions and the widgets in each (placement order, grid column, span, full-width, static) through `describeSessions`.
- What the copilot can currently do, through `useFrontendTool`:
  - `addWidget`, `removeWidget` (`WidgetCopilotFunctions.tsx`);
  - `setWidgetProperties` (`WidgetPropertyCopilotFunctions.tsx`);
  - `setWidgetLayout` (`WidgetLayoutCopilotFunctions.tsx`).
- No copilot tool uses `addSession`, `updateSession` or `removeSession`. `WidgetCopilotFunctions` only calls `placeWidget` from `useSessionActions`, to set a widget's grid layout when it is created.
- As a result the copilot can read the sessions but cannot create, rename, edit or delete them, so requests like "split this form into two steps" or "rename the first section" cannot be carried out.

## Acceptance Criteria

Clarified with the user:

- [x] Support session handler for project: the copilot can add, update and remove sessions.
- [x] Add session: `addSession({ name, icon?, description? })`, id generated, appended after the last session.
- [x] Update session: `updateSession({ sessionId, name?, icon?, description? })`; only the given fields change, an empty `description` clears it.
- [x] Remove session: allowed with widgets (they are deleted with it, as `SessionHandler.removeSession` does); removing the last session is rejected with an `Error: ...` sentence.
- [x] `icon` must be a `TomatoIconKey`; an unknown key is rejected.
- [x] `condition` is not editable by the copilot.
- [x] Reordering sessions is out of scope (sessions have no order field; needs its own ticket).

## Solutions

- [x] Base on `SessionHandler.ts` (through `useSessionActions`)
- [x] Base on `....CopilotFunctions.tsx`
- [x] Handle function for copilot-kit

## Changelogs

- New `copilotSession.ts`: `sessionPropertiesInput` / `sessionPatchInput` (name trimmed and non-blank, `icon` as `TomatoIconKey`, plain-text `description`), `toSessionProperties`, `toSessionPatch` (empty description clears).
- New `SessionCopilotFunctions` registers `addSession`, `updateSession`, `removeSession`; mounted in `TemplateCopilot`. Unknown session, empty update and removing the last session return an `Error: ...` sentence and write nothing.
- `copilotTemplateContext.describeSessions` now also sends each session's `icon` and plain-text `description`.
- `copilotWidgetProperties.ts` exports `toEditorState` / `editorStateToText` for reuse.
- Tests: `copilotSession.test.ts`. Not run: lint, typecheck (per project rules).
- Not covered: reordering sessions, editing `condition`, adding widgets straight into a new session (add the session, then `setWidgetLayout`).
