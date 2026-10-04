# [WidgetCopilot] Support passing properties in `addWidget`

## Currently

- The copilot `addWidget` tool is registered in `website/src/features/template/sync/copilot/WidgetCopilotFunctions.tsx`.
- It only accepts `type` and `beforeWidgetId`. The widget is created with default properties.
- To give a new widget a label, placeholder or required flag, the copilot has to call `addWidget`, read the returned id, then call `setWidgetProperty` once per property.
- `setWidgetProperty` supports only the scalar keys `label`, `placeholder` and `required` (`COPILOT_PROPERTY_KEYS`).

## Acceptance Criteria

- Copilot should support with more options

Clarified with the user:

- [x] Every `WidgetProperties` key is settable by the copilot: scalars, `options`, `url`, style objects (`textStyle`, `containerStyle`) and `content` / `actions` / `apiCall`.
- [x] `addWidget` accepts an optional `properties` object, applied when the widget is created.
- [x] The property tool takes one partial `properties` object (many properties per call).
- [x] `WidgetPropertyCopilotFunctions` replaces `setWidgetProperty`.

## Solutions

- Base on properties `WidgetProperties`
- Base on `WidgetCopilotFunctions`
- Add `WidgetPropertyCopilotFunctions` support function update `properties` of `widget`
- Enhance `WidgetCopilotFunctions` - `addWidget` allow support create with `properties` of widget

## Changelogs

- `WidgetHandler.addWidget` / `useWidgetActions.addWidget` are unchanged (base function not updated). New `WidgetHandler.setProperties` writes many properties at once and emits one `WidgetPropertyChangedEvent` per key; `useWidgetActions` exposes it as `setProperties`.
- New `copilotWidgetProperties.ts` (`website/src/features/template/sync/copilot/`): `widgetPropertiesInput` zod schema covering every `WidgetProperties` key in a model-friendly shape (`options` as plain strings, `content` as plain text with newline = paragraph, no ids/indexes), `toWidgetProperties` (generates option keys + fractional indexes, Lexical state, api-call row ids; keeps the key of an option whose text is unchanged), `findUnknownWidgetIds` (rejects `apiCall` references to widgets that do not exist) and `describeWidget` (what the copilot sees of a widget).
- New `WidgetPropertyCopilotFunctions` registers `setWidgetProperties({ widgetId, properties })`, replacing the removed `setWidgetProperty` (and its `COPILOT_PROPERTY_KEYS` / string-parsing helpers).
- `addWidget` tool takes optional `properties`; it calls `addWidget`, then `setProperties` on the new id (two transactions, so two undo steps). The widgets context sent to the copilot now includes all properties (as a JSON string, since unset properties are `undefined`).
- Not run: tests, lint, typecheck (per project rules).
