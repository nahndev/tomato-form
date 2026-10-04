# [WidgetCopilot] Support layout of widgets

## Currently

- Follows [widget-copilot-add-widget-properties.md](widget-copilot-add-widget-properties.md), which lets the copilot set every `WidgetProperties` key but nothing about where a widget sits on the grid.
- The copilot tools are `addWidget`, `removeWidget` and `setWidgetProperties` (`website/src/features/template/sync/copilot/`). None of them takes or changes a layout (`column`, `span`, `idx`, `isFullWidth`, `isStatic`).
- A widget added by the copilot gets its type's default layout (`DEFAULT_LAYOUTS`) and is placed before `beforeWidgetId` or at the end of the session, by `LayoutHandler.onWidgetAdded`.
- After that the copilot cannot move a widget, put two widgets side by side, resize one, or move one to another position. Requests like "put first name and last name on one row" or "make the description full width" cannot be done.
- The user does this on the canvas: `SessionCanvas` calls `useSessionActions().updateLayout(widgetId, sessionId, patch)` on drag (`column`, `idx`) and resize (`span`), which goes to `LayoutHandler.setLayout`.
- The copilot can already read the layout: `TemplateCopilotContext` sends the grid (8 columns, from `packages/grid/src/constants.ts`), the sessions with each widget's `column` / `span` / full-width / static in placement order, and each widget type's default layout (see [add-template-builder-copilot-context.md](add-template-builder-copilot-context.md)).
- The grid rules the model must follow: columns 0 to 7, `column + span` must not exceed 8, a full-width widget ignores both, widgets stack top to bottom by `idx` and share a row only when their columns do not overlap.

## Acceptance Criteria

Clarified with the user:

- [x] Move widget: change `column` and the place in the order (`idx`).
- [x] Resize widget: change `span` and `isFullWidth`.
- [x] Layout when adding: `addWidget` accepts an optional `layout`.
- [x] Move between sessions: the layout tool takes an optional `sessionId`.
- [x] The order is given as `afterWidgetId` (the model never handles raw `idx`). `addWidget`'s `beforeWidgetId` is renamed `afterWidgetId`: `LayoutIdx.getInsertIdx` always placed the widget after the given one, as the toolbar does.
- [x] A layout that breaks the grid rules is rejected with an `Error: ...` sentence; nothing is written.
- [x] Grid-rule validation stays in the copilot layer (`packages/grid` is not changed).

## Solutions

- [x] Base on `TemplateSnapshot::layouts`
- [x] Base on `LayoutHandler`
- [x] Base on `website/src/features/template/sync/copilot/WidgetCopilotFunctions.tsx`

## Changelogs

- `LayoutHandler.placeWidget(widgetId, { layout?, sessionId?, position? })`: one write that patches `column` / `span` / `isFullWidth`, moves the widget to another session and/or reorders it (`"first"`, `"last"` or `{ after }`, computed among the other widgets so the moved widget never counts itself). Keeps what is omitted; no-op for a widget without a layout. Also `getSessionId`. `useSessionActions` exposes it as `placeWidget` (one undo step).
- New `copilotWidgetLayout.ts`: `widgetLayoutInput` (`column`, `span`, `fullWidth`), `findLayoutError` (column + span must fit the 8-column grid unless full width, checked against the current or default layout) and `toPlacementLayout` (only the fields the model gave).
- New `WidgetLayoutCopilotFunctions` registers `setWidgetLayout({ widgetId, column?, span?, fullWidth?, afterWidgetId?, moveTo?, sessionId? })`. Rejects an unknown widget / session, `afterWidgetId` together with `moveTo`, an `afterWidgetId` that is the widget itself or not in the target session, and a layout that does not fit. Moving to another session without a position puts the widget last there.
- `addWidget` tool: `beforeWidgetId` renamed `afterWidgetId`; new optional `layout`, checked against the type's default layout. Add, properties and layout now run in one transaction (one undo step).
- Copilot context: grid rules say `afterWidgetId` and explain how to put widgets on one row or on a row of its own.
- Tests: `LayoutHandler.test.ts`, `copilotWidgetLayout.test.ts`. Not run: lint, typecheck (per project rules).
- Not covered: `isStatic` widgets are not blocked from being moved by the copilot; adding a widget straight into another session (needs add then `setWidgetLayout`).
