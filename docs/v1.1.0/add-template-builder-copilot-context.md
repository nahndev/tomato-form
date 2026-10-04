# Add more context for the template builder copilot

## Currently

- The copilot is mounted by `TemplateCopilot` ([website/src/features/template/sync/copilot/TemplateCopilot.tsx](../../website/src/features/template/sync/copilot/TemplateCopilot.tsx)), edit mode only.
- The only context the model receives is registered in `WidgetCopilotFunctions` ([website/src/features/template/sync/copilot/WidgetCopilotFunctions.tsx](../../website/src/features/template/sync/copilot/WidgetCopilotFunctions.tsx)) through `useAgentContext`:
  - the widgets currently in the template (`describeWidget`: id, type, label, placeholder, required, options, content, url, actions, apiCall, compact, textStyle, containerStyle);
  - the widget types that can be added (type, label, description).
- The system prompt lives in `AGENT_PROMPT` in `copilot-server/src/copilot/copilot.service.ts`. It is one short paragraph and still says the copilot can only change a widget's "label, placeholder or required flag", which is out of date now that `setWidgetProperties` can set every property.
- The copilot has no knowledge of:
  - the template itself (name, description, version/status);
  - the layout of the widgets (groups / nesting, order beyond the array order);
  - what each property means or which properties each widget type supports;
  - the values a widget can produce and how widgets reference each other (`apiCall`, mapping, display);
  - the current selection in the builder (selected widget, open properties dialog);
  - the other widget capabilities documented in [docs/WIDGET.md](../WIDGET.md).
- Because of this the model has to guess from the widget list alone, so requests like "make the selected field required", "add a field like the one above" or "build a registration form" depend on what the model happens to infer.

## Acceptance Criteria

- [ ] Add more context about form for UI, support for AI template

Clarified with the user:

- [x] Context to add: grid & layout, widget capabilities, template info, builder selection.
- [x] Context only: no new copilot tools.
- [x] Static knowledge is generated from code (registries and grid constants), not hand-written in the prompt.

## Solutions

- [x] Add context base on `packages/grid/src/constants.ts`

## Changelogs

- `@tomato/grid` index now exports `GRID_COLUMNS`, `COLUMN_WIDTH`, `CONTAINER_MIN_HEIGHT`.
- New `copilotTemplateContext.ts` (`website/src/features/template/sync/copilot/`): pure builders for the context - `describeGrid` (grid constants + placement rules), `describeWidgetTypes` (per type: group, whether it produces a value, value types, settable properties from `WIDGET_PROPERTY_REGISTRY`, default layout), `describePropertyMeanings` (one sentence per `WidgetProperties` key, typed `Record<WidgetPropertyKey, string>` so a new key must be described), `describeSessions` (sessions with their widgets in placement order and each widget's column/span/full-width/static), `describeTemplate`, `describeSelection`.
- New `TemplateCopilotContext` registers those through `useAgentContext`; mounted in `TemplateCopilot`. It replaces the old "widget types that can be added" context in `WidgetCopilotFunctions`.
- The template has no description or status field, so the template context is the live name and the published version (`never published` until the first publish).
- "Open properties dialog" is local state of `ToolbarPanel`; the copilot gets the selected widget, which is what the panel shows.
- Not changed: `AGENT_PROMPT` in `copilot-server` (context only, as agreed) - it still says the copilot can only change label, placeholder or required, which is out of date.
- Not run: tests, lint, typecheck (per project rules).
