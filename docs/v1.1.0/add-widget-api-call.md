# Add new widget - Api call

## Currently

- The widget system is driven by the `WidgetType` enum
  (`website/src/types/widget.ts`): `text`, `text-area`, `number`, `date`,
  `datetime`, `time`, `select`, `checkbox`, `radio`, `label`, `signature`,
  `button`, `image-uploader`, `file-uploader`, `board`, `break`, `session`,
  `users`, `created-at`, `template`, `submitted-by`. No `api-call` (or
  equivalent) widget type exists.
- The only widget that performs an outbound side effect today is `BUTTON`,
  via its `actions?: ButtonAction[]` property
  (`website/src/types/template.ts`). `ButtonAction` currently supports two
  action types only (`website/src/types/button-action.ts`):
  `link` (`LinkAction { type, url }`) and `mail` (`MailAction { type,
recipients, subject, body }`). Neither performs an HTTP request to an
  arbitrary API or captures a response.
- `WidgetProperties.url?: string` exists, but it is a legacy fallback
  consumed only by `ButtonWidgetItem.tsx` to synthesize a `LINK` action
  (`widget.url ? [{ type: ButtonActionType.LINK, url: widget.url }] : ...`).
  It is not a generic request-config field.
- Adding a new widget type is documented as a 7-step process in
  `docs/WIDGET.md` (`WidgetType` entry, `DEFAULT_SETTINGS`,
  `DEFAULT_LAYOUTS`, `WidgetItems`, a `<Type>WidgetItem.tsx` implementing
  `FieldComponentProps<TValue>`, `WidgetComponents` registry, and
  `WIDGET_PROPERTY_REGISTRY` for the property panel). The same field
  component renders both on the builder canvas (wrapped in `<div inert>`,
  no `value`/`onChange`) and on the fill page
  (`SubmissionWidgetItem.tsx`, unwrapped, wired to real `value`/`onChange`).
- Known gaps noted in `docs/WIDGET.md`: no backend upload endpoint for
  `image-uploader`/`file-uploader`/`signature`/`board` (client-side data
  URLs / file metadata only); no widget currently makes a network request
  for data.

## Acceptance Criteria

- [x] Add new WidgetType call Api request
- [x] Must include basic feature with other components
- [x] Request group
- [x] Property::host - choice host from list
- [x] Property::method - GET, POST, PATCH, DELETE, PUT
- [x] Property::url - fill url for api
- [x] Property::params - can fill or choice component value
- [x] Property::header - cal fill or choice component value
- [x] Property::payload - json editor with component placeholder
- [x] Response group
- [x] Property::type - json, image
- [x] If image - Show: show after load - Fill: choice component to fill value to component
- [x] If json: - Show: show after load - Fill: fill key and choice component, which after load will fil value

## Solutions

- Base on postman
- [ ] Add new WidgetType call Api request -> add components and all other property, link, display, ...
- [ ] Must include basic feature with other components
- [ ] Request group -> A group layout
- [ ] Property::host - choice host from list -> choice from setting, but current using mock
- [ ] Property::method - GET, POST, PATCH, DELETE, PUT -> choice with color for every method
- [ ] Property::url - fill url for api -> Create new ui `UrlEditor` extend from `RichEditor` with placeholder for params of path, validate after blue
- [ ] Property::params - can fill or choice component value
      -> list as table, left is input for key, center default is input allow fill value, with right icon, when click icon then it will change to choice component mode, show list component (display-text must support), end is action as `delete`, `duplicate`

- [ ] Property::header - cal fill or choice component value
      -> Same with params but for header
- [ ] Property::payload - json editor with component placeholder
      -> Add new ui `JsonEditor` with placeholder is `component`, will auto loading from other components
- [ ] Response group - layout with group
- [ ] Property::type - json, image -> selector
- [ ] If image - Show: show after load - Fill: choice component to fill value to component
- [ ] If json: - Show: show after load - Fill: fill key and choice component, which after load will fil value
- [ ] For fill or choice component, create new ui `ValueOrWidget` with accept `display_type`
- [ ]

## Changelogs

Implemented the `api-call` widget's builder-side property panel, following
`docs/WIDGET.md`'s 7-step "add a widget" process. Deviations from the
`Solutions` sketch above (each clarified with the user before implementing,
per this repo's ticket rules — ambiguity is never guessed):

- **Execution deferred.** This change ships every property editor in the
  Acceptance Criteria, but does not send any HTTP request and does not
  implement one widget writing another widget's fill-time value (needed for
  the response "Fill" behavior to actually do anything). `ApiCallWidgetItem`
  renders a static method/url summary only. Sending the request (client vs.
  a backend proxy has real CORS/SSRF trade-offs) and the cross-widget
  value-write mechanism are follow-up work — see `docs/WIDGET.md`'s "Known
  gaps".
- **No `RichEditor` base for `UrlEditor`.** No such component exists in this
  codebase; the closest thing (`components/lexical/TextEditor`) operates on
  Lexical's `SerializedEditorState`, not plain strings. `UrlEditor` and
  `JsonEditor` are a plain `Input`/`Textarea` plus a dropdown that inserts a
  `{{widget.label}}` token at the cursor, with non-blocking blur validation.
- **Host list is a hardcoded mock**, in
  `constants/widget/apiHosts.ts` (`API_CALL_HOSTS`) — no settings/host
  management feature exists yet to source it from.
- **Interpolation token**: `{{widget.label}}`, resolved by label at request
  time (not a stable id — renaming a referenced widget's label breaks the
  reference; accepted trade-off for readability while editing).
- **JSON response key format**: dot-path (e.g. `data.user.name`), not
  JSONPath.
- **Single bundled property** (`WidgetProperties.apiCall: ApiCallConfig`,
  in `types/api-call.ts`) instead of one `WidgetProperties` key per
  Acceptance Criteria bullet — same pattern as the existing `actions` field
  on `BUTTON`.
- No `ValueOrWidget`/table-literal UI as separately named in `Solutions`;
  params/headers use one shared `KeyValueListEditor` row editor instead.

Files touched: `types/widget.ts`, `types/template.ts`, new `types/api-call.ts`,
`constants/widget/{settings,layouts,widgetItems}.ts`, new
`constants/widget/apiHosts.ts`, `components/widget/registry.ts`, new
`components/widget/items/ApiCallWidgetItem.tsx`,
`components/property/{types,registry}.ts`,
`components/property/descriptors/registry.ts`, new
`components/property/descriptors/apiCall/*`, and
`packages/icon/src/icons.ts` (added `Webhook`, `Copy`). Also added
`widgetId` to `WidgetPropertyFieldProps` (threaded through from
`WidgetPropertyContent.tsx`) so a descriptor can exclude its own widget from
a component picker — updated `OptionsDescriptor.test.tsx` accordingly.
