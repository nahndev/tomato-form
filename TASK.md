# Make board layout

Scope: `./website/src/features/workspace`

- Currently, the `WorkspaceContent` should `SubmissionList` only
- It is every simple, now i will improve it

## Tasks 01 - Spit layout

- [x] Move `workspace` out `(main)` group
- [x] The `WorkspaceBoardHeader` is design <title> <filter> ---- <list-pages><button>
- [x] The `WorkspaceBoardContent` show list of `submissions`

## Tasks 02 - Add custom column for board

- [ ] The board include custom column, which will should on layout
- [ ] Add available display types for every `widget`, ex:
  - The `WidgetType.DATE` can display as `text`, `date`,
  - The `WidgetType.DATETIME` can display as `text`, `time`, `date-time`
  - The `WidgetType.SIGNATURE is not display -> return empty
  - ...
- [ ] Add library allow get value of widget, every display-type will has a getter. accept `widget` and `json` -> return same type
- [ ] Every `column` in board, all `widget` my same type.
- [x] When create template, add default `widget` is `Created At`, `Template`, `By`,.... (add new types and registry)
- [ ] In the `BoardPage`, add tabs allow update `columns`
- [ ] In `WorkspaceBoardContent`, every submission include first column is name, the left is list of columns
