# Add feature `Submission` for project

## Scope

- Add `./website/src/features/submission`
- URL: `./submission/{uuid}`

## Purpose and rules

- We have `template` allow design form. This feature is show form and allow fill value.
- Every `submission` will using `template` with `version` and `data`

## Tasks 01 - Add connected user

- [x] Add new type `Principal`

```typescript
export interface Principal {
  sub: string;
  email: string;
  tenantId: string;
  name: string;
  roles: string[];
}
```

- [x] Add zustand store for it
- [x] Make `mock` for `principal`

## Tasks 02 - Implement submission

- [x] Move `WidgetType` from `./website/src/types/template.ts` -> `./website/src/types/widget.ts`
- [x] Add new `yjs` type is `submission`
- [x] The form should same template, but UI can't edit. Only interaction with content of `Widget`
- [x] The form save in `submission` of `yjs`.
- [x] The `submission` using last version of `template` (don't using default)

## Widget behaviors

TEXT - input a text
TEXT_AREA - input a text-area
NUMBER - input a number
DATE - input a date picker
DATETIME input a datetime picker
TIME input a time picker
SELECT - select a value of list
CHECKBOX - check a value of list (multiple active)
RADIO - check a value of list (a only)
LABEL - Shown only
SIGNATURE - allow user click,
BUTTON - a button with action (implement after)
IMAGE_UPLOADER - allow upload a image and show it
FILE_UPLOADER - allow upload files, show list
BREAK : show only
SESSION: show only
USERS : allow pick users

## Tasks 03 - Build action menu

- The `BUTTON` include multiple `actions`
  - Mail actions - Send mail with `recipient setup`, `subject`, `content`
  - Submit actions - default, all session hidden (first session should show). Submit action include `to-session` (default is next session). When click `submit` -> open `to-session`
  - Return action - `to-session` will to `previous` session.
  - `Flow` of session appear save in flow
  - .... suggest and add more actions.
