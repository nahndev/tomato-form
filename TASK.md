# Add SessionSettingPopup for UI

## Tasks 01 - Implement submission UI

[yjs-server]

- [x] Standardize `documentName` for all `yjs` with format `<type>/<id>/version` -> save to folder `type` - folder `id` - folder `version`
- [x] Update for `./yjs-server/server.ts`
- [x] Update for `TemplateDocProvider`
- [x] Update for `SubmissionProvider`

## Tasks 02 - Implement condition for session

[website] - `./website/src/features/template`

- [x] In SessionBox - Add setting popup when click icon in SessionHeader
- [x] Add Condition - condition allow show item

  - Default: always
  - When click BUTTON
  - When has value in a WIDGET

- [x] Base on `data` of `submission` - parse `conditions` to `result`

## Tasks 03 - Adjust `TemplateVersion`

Note: Suggest and apply name for record `<design>` -> applied as `snapshot` (matches the codebase's existing vocabulary for this exact concept - `TemplateVersionSnapshot`, "published (static) snapshot", "structure is frozen" - a frozen copy of the yjs doc at publish time: widgets/layouts/sessions/properties/widgetToSession, extensible without a migration).

[server]
[schema.prisma]

- Currently, `TemplateVersion` include `widgets`, `session`, `properties`, ....
- But, every add new record (ex: `sessionProperties`), I must add new record to database
- [x] In `TemplateVersion` add new record `<design>` is `jsonb`
- [x] In `makeVersionFile` move `widgets`, `session`, `properties`, ... (which load from `yjs`) into `<design>`

[website]

- [x] Adjust UI same with changes in [server]

## Tasks 04 - Add new properties for

[website]

- Currently, the `condition` and other properties of `session` save within itself. It don't helpful with `yjs`
- [x] `yjs` add new record `sessionProperties`
- [x] Move all `properties` of `session` to `sessionProperties`
