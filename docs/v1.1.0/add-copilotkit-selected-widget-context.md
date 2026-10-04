# Add CopilotKit context about the current selected widget

## Currently

- The builder keeps one selected widget: `WidgetSelectionProvider` in [website/src/features/template/components/provider/TemplateProvider.tsx](../../website/src/features/template/components/provider/TemplateProvider.tsx) wraps `useSelection(values(widgets), "id")` and exposes it through `useWidgetSelection()` (`selected`, `isSelected`, `select`, `selectKey`, `toggle`). The selection is local React state, not part of the yjs doc. It is set from the canvas (`WidgetItem`) and the structure toolbar (`StructureToolbarBox`), and read by `ToolbarPanel` for the properties panel.
- The copilot already receives a selection context: `TemplateCopilotContext` ([website/src/features/template/sync/copilot/TemplateCopilotContext.tsx](../../website/src/features/template/sync/copilot/TemplateCopilotContext.tsx)) registers it through `useAgentContext` with `describeSelection(selected)` ([website/src/features/template/sync/copilot/copilotTemplateContext.ts](../../website/src/features/template/sync/copilot/copilotTemplateContext.ts)). It was added by [add-template-builder-copilot-context.md](add-template-builder-copilot-context.md).
- What that context carries today is only `{ widgetId, type, label }`, or `null` when nothing is selected. The description tells the model that "this field" / "the selected widget" mean this one.
- Everything else about the selected widget is in other contexts the model has to join by id:
  - properties (`describeWidget`), registered in `WidgetCopilotFunctions` for all widgets;
  - session and grid layout (`describeSessions`): the selected widget's session, column, span, full-width, static and neighbours are not marked in it;
  - settable properties and default layout per type (`describeWidgetTypes`).
- The selection is not tied to the copilot tools: `setWidgetProperties`, `setWidgetLayout` and `removeWidget` always take an explicit `widgetId`, so for "make this field required" the model must map the selection to an id itself.
- Whether the selection is empty, the widget was just added, or the selected widget was removed (the hook then returns `null`) is not told to the model apart from the value being `null`.
- Sessions have no selection state at all: there is no "current session" for requests like "add a field here" or "rename this section".

## Acceptance Criteria

- [x] Add context for copilot kit for template with selection widget

Clarified with the user:

- [x] The selected widget's context carries its full properties, its session and layout, its neighbours in the session and the properties its type can set.
- [x] The old `describeSelection` context is replaced, not kept beside a second one.
- [x] The copilot also knows a current session, with no new builder state: it is the selected widget's session, or the first session while no widget is selected.
- [x] Context only: tools keep requiring explicit ids.

## Solutions

- [x] use hook get widget, convert to context

## Changelogs

- `describeSelection` (`copilotTemplateContext.ts`) now takes the selection plus the sessions state and returns `{ widget, currentSession }`. `widget` is `null` when nothing is selected, otherwise `{ widgetId, type, label, properties (describeWidget), settableProperties, layout, session, position { index, of }, previousWidgetId, nextWidgetId }`. `currentSession` is `{ id, name, derivedFrom: "selected-widget" | "first-session" }`, or `null` in a template without sessions.
- `describeSessions` and `describeSelection` share `orderedSessionWidgets` (placement order by layout `idx`).
- `TemplateCopilotContext` registers the selection and the sessions contexts as JSON strings (they hold unset fields) and its description tells the model how to read "this field" / "this section" / "add a field here".
- Tests: `copilotTemplateContext.test.ts`. Not run: lint, typecheck (per project rules).
- Not covered: a clickable/highlighted session selection in the builder, and tools defaulting to the selection when the id is omitted.
