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

## Tasks 03
