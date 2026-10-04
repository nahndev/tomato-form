# Support display for user-widget

## Currently

- The `users` widget (`UsersWidgetItem`, `website/src/features/template/components/widget/items/UsersWidgetItem.tsx`) is a single `Select` fed by `useUserStore` (`website/src/store/user.store.ts`). It lists every user as `<SelectItem value={user.uuid}>{user.name}</SelectItem>`, so the stored submission value is the user's **`uuid`** (`string`), not the name.
- Backend `UsersWidgetValue` (`server/src/widget-value/widgets/entity.widget-value.ts`, shared with `submitted-by`) maps only `default` through `EntityValue` (`values/entity.value.ts`), which stringifies the raw value(s) into the `entity` bucket. For a `users` widget that bucket therefore holds user uuids; there is no `text` bucket.
- Frontend `WIDGET_VALUE_TYPE_REGISTRY` (`website/src/features/board/constants/column/valueTypes.ts`) exposes `users` as `default` -> `DisplayType.TEXT`. `TextValue` renders through `parseLabelDisplayValue` (`features/board/utils/submissionDisplayValue.ts`): it uses the `text` bucket if non-empty, otherwise the `entity` bucket joined with `", "`.
- Result: on a board column (and in chart group-by labels, which share `parseLabelDisplayValue`), a `users` widget shows the raw user uuid(s) instead of the user's name.
- `SubmissionDisplayService.buildDisplayDoc` (`server/src/display/submission-display.service.ts`) is built only from the submission and the template snapshot; `MappingContext` / `WidgetValueInterface.map()` are synchronous and have no access to the `User` records (`server/src/database/schema.prisma`, `User { uuid, name, email }`), so the backend has no way to resolve a uuid to a name today. The only place user names are available is the frontend `useUserStore` (also kept live through the `users:updated` socket event).
- `dataDisplays` is a cache stored on the submission, computed when a submission is created or its values change (see `submission.service.ts`), so a resolved name there would not automatically follow later user renames/deletions.
- `submitted-by` shares the same `EntityWidgetValue` and has the same raw-uuid behaviour, but is not named in this ticket's title.
- Related: `docs/v1.1.0/support-choice-text-value-type.md` (the choice widgets resolve option keys to text through `widget.options`; `users` has no equivalent source of text inside the template snapshot).

## Acceptance Criteria

- [x] user widget should show text in board (also `submitted-by`, which shares the contract; a user that no longer exists is skipped)

## Solutions

- [x] user widget for value-type default include display-type for text: `UserWidgetValue` (`widgets/user.widget-value.ts`) keeps a single `default` value type, resolved through `UserValue` (`values/user.value.ts`) into `DISPLAY_TYPE.ENTITY` (uuids) and `DISPLAY_TYPE.TEXT` (names, joined by `", "`)
- [x] Names are resolved on the backend when `dataDisplays` is built: `SubmissionDisplayService.buildDisplayDoc` is now async, injects `UserService`, and loads users once, only when the snapshot has a `users`/`submitted-by` widget; they reach the mapper through `MappingContext.getUsers()`
- [x] Missing user: skipped from `text`; the board shows the empty placeholder, not the raw uuid (`parseLabelDisplayValue` treats `text` as authoritative when both buckets exist)
- [ ] Known limitation: `dataDisplays` is a cache, so a user rename/delete is not reflected in existing submissions until they are next recomputed (on create or value change). Recomputing on user change is not part of this ticket.
- [x] Tests: `widget-value.factory.spec.ts`, `submission-display.service.spec.ts`, `submissionDisplayValue.test.ts`

## Changelogs

- `server/src/widget-value/values/user.value.ts` (new): `UserValue` returns `{ entity: uuids, text: "Alice, Bob" }`; reuses `EntityValue` and `CHOICE_TEXT_SEPARATOR`.
- `server/src/widget-value/widgets/user.widget-value.ts` (renamed from `entity.widget-value.ts`): `UserWidgetValue` (+ `Users`/`SubmittedByWidgetValue`) replaces `EntityWidgetValue`, which had no other users once the choice widgets moved out.
- `server/src/widget-value/mapping-context.ts`, `widget-value.types.ts`: optional `MappingSource.users`, `MappingContext.getUsers()`, `USER_REFERENCE_WIDGET_TYPES`.
- `server/src/display/`: `SubmissionDisplayService.buildDisplayDoc` is async and loads user names; `DisplayModule` imports `UserModule`. `submission.service.ts` awaits it.
- `website/src/features/board/utils/submissionDisplayValue.ts`: `parseLabelDisplayValue` no longer falls back to raw `entity` keys when `text` is present but empty. This also applies to the choice widgets (a deleted option no longer shows its raw key).
- Specs: `submission-display.service.spec.ts` now builds full `Submission` mocks (it did not compile before) and has the stale select expectation fixed; `submission.service.spec.ts` mocks `buildDisplayDoc` as async. Pre-existing and unrelated, still failing: `created-at` null test in `widget-value.factory.spec.ts`, and 5 mock-shape failures in `submission.service.spec.ts`.
