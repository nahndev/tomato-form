# Adjust action for button widget

## Currently

- `WidgetProperties.actions?: ButtonAction[]` (`website/src/types/template.ts`) stores an ordered list of actions run in sequence on click for `WidgetType.BUTTON`. A legacy `WidgetProperties.url?: string` field still exists and is used as a fallback single `link` action when `actions` is unset (`ButtonWidgetItem.tsx`).
- `ButtonAction` (`website/src/types/button-action.ts`) is a discriminated union with two types today:
  - `link`: `{ type: "link", url: string }`
  - `mail`: `{ type: "mail", recipients: Recipient[], subject: string, body: string }` (`Recipient` is `{ type: "mail" | "user", value: string }`)
- Actions are edited via `ActionsDescriptor` (`website/src/features/template/components/property/descriptors/ActionsDescriptor.tsx`) — add/remove/reorder list, a type select (Open link / Send mail) per entry, and per-type fields.
- Execution goes through `ButtonActionContext`/`useRunButtonAction` (`website/src/features/template/components/widget/ButtonActionContext.tsx`), which has two implementations:
  - Builder/preview default context: only `link` is handled (`window.open`); `mail` is a no-op that just `console.warn`s.
  - `SubmissionButtonActionProvider` (fill wizard): both are wired for real — `link` opens the URL, `mail` calls `submissionApi.sendMail(...)` with toast success/error feedback.
- No other action types exist (e.g. no "submit form" action). `SessionConditionType.BUTTON_CLICKED` is a separate session-visibility condition, not a button action.

## Acceptance Criteria

- [x] Re-structure of actions, simply for extend
- [x] Re-structure and split component

## Solutions

- [x] Create new folder in website/src/features/actions include `components`, `utils`, `hooks`, ...
- [x] Split into `MailActionSetup` and `OpenLinkActionSetup`
- [x] Split behaviour of template, board, submission (board doesn't render/run button actions today - only template and submission do, so nothing to split there; see changelog)

## Changelogs

- Added `website/src/features/actions/` feature (`components/`, `context/`, `hooks/`, `utils/`), moving the button-action editor and runtime out of `template`/`submission` into a shared, extensible location.
- Added `ACTION_REGISTRY` (`features/actions/registry.ts`) keyed by `ButtonActionType`, holding each type's label, default-value factory, and setup component. `ActionsDescriptor` now renders off this registry instead of switching on `action.type`; adding a new action type only requires one registry entry, not edits across the descriptor/providers.
- Split the old inline `ActionFields` switch into `OpenLinkActionSetup.tsx` and `MailActionSetup.tsx` (both under `features/actions/components/`); `RecipientsEditor.tsx` also extracted out of `ActionsDescriptor.tsx` into its own file.
- Moved `ButtonActionContext`/`ButtonActionProvider` to `features/actions/context/ButtonActionContext.tsx` and the `useRunButtonAction` hook to `features/actions/hooks/useRunButtonAction.ts` (previously both lived in one file under `features/template/components/widget/`).
- Extracted the `link` action's `window.open` behavior into a shared `runLinkAction` util (`features/actions/utils/runLinkAction.ts`), used by both the template/builder default context and `SubmissionButtonActionProvider` so the two contexts no longer duplicate that logic.
- Investigated splitting "board" behavior per the ticket: `system/boards` (`BoardColumnCell`) only renders read-only display values for submissions and never mounts `ButtonWidgetItem` or runs a button action, so there's no board-specific action behavior to split out. Only `template` (builder default context - `link` works, `mail` warns as unsupported) and `submission` (`SubmissionButtonActionProvider` - both wired for real) have runnable behavior.
- Updated all consumers (`ButtonWidgetItem.tsx`, `descriptors/registry.ts`, `SubmissionButtonActionProvider.tsx`) to import from the new `features/actions` paths; deleted the old `features/template/components/property/descriptors/ActionsDescriptor.tsx` and `features/template/components/widget/ButtonActionContext.tsx`.
