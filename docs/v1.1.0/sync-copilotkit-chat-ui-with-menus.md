# Sync CopilotKit chat UI with the other menus

## Currently

- The other builder menus (Widget, Structure, Properties, Version) live in `ToolbarPanel` ([website/src/features/template/components/toolbar/ToolbarPanel.tsx](../../website/src/features/template/components/toolbar/ToolbarPanel.tsx)), registered in `TOOLBAR_REGISTRY` (`website/src/features/template/constants/toolbar/registry.ts`). It is the right sidebar of `TemplateBuilder.tsx`: a `w-[25em]` docked panel beside a vertical icon strip (`ToolbarMenuList`).
- Each of those menus has a `ToolbarHeader` (`bg-slate-100`, uppercase `text-xs` muted title, a mode `ButtonIcon`) and can be shown docked in the sidebar or as a `Dialog` popup. The mode is persisted per browser by `useToolbarModeStore` (`website/src/store/toolbar-mode.store.ts`, see `docs/v1.1.0/support-properties-menu-popup-mode.md`).
- The CopilotKit chat is not part of that menu group. `TemplateCopilotPopup.tsx` ([website/src/features/template/sync/copilot/TemplateCopilotPopup.tsx](../../website/src/features/template/sync/copilot/TemplateCopilotPopup.tsx)) renders the CopilotKit v2 `CopilotPopup` with only `modalHeaderTitle` ("Template assistant") and `welcomeMessageText`. `TemplateCopilot.tsx` mounts it beside `children`, inside `CopilotKitProvider`, in edit mode only.
- As a result the chat looks and behaves differently from the other menus:
  - It is a floating CopilotKit popup with its own default launcher button and its own `@copilotkit/react-core/v2/styles.css` look (header, colors, radius, fonts, spacing). It does not use the `ToolbarHeader` style or the `slate` colors of the other menus.
  - It has no entry in the icon strip or in `TOOLBAR_REGISTRY`, so it is opened and closed separately from the other menus.
  - It has no docked sidebar mode and no mode button, so it ignores the docked/popup choice that every other menu follows.
  - Its open state is independent of the toolbar's active tab, so the chat popup and a sidebar tab can both be open at the same time.
- Goal: make the CopilotKit chat UI consistent with the other menus.

## Acceptance Criteria

- [x] Change UI of copilotkit chat same with other layout of ToolbarPanel

## Solutions

- [x] Update UI for copilotKit

## Changelogs

- Interpretation of the acceptance criterion (not separately confirmed): "same layout as ToolbarPanel" = the chat becomes a `ToolbarPanel` tab, so it gets the shared header, the icon strip entry and the docked/popup mode.
- `website/src/features/template/sync/copilot/TemplateCopilotChat.tsx`: new tab body, an embedded CopilotKit v2 `CopilotChat` filling the panel (`min-h-[28rem]` so the popup `Dialog`, which has no fixed height, still gives it room).
- `website/src/features/template/sync/copilot/TemplateCopilotPopup.tsx`: deleted (the floating `CopilotPopup` and its launcher button). `TemplateCopilot.tsx` no longer mounts it; it still provides `CopilotKitProvider` and the widget functions.
- `website/src/features/template/constants/toolbar/registry.ts`: new `ToolbarType.Chat` ("Assistant", `Message` icon) with an `editOnly` flag on `ToolbarDefinition`.
- `website/src/features/template/components/toolbar/ToolbarPanel.tsx`: the icon strip shows `editOnly` tabs only in edit mode, because the `CopilotKitProvider` (needed by `CopilotChat`) only exists in edit mode.
- `docs/WIDGET.md`: documented the Assistant tab.
- Not verified: nothing was run, linted or type-checked (project rule). The `CopilotChat` props (`className`, `labels`) were checked against the installed `.d.cts` types only. Selecting a widget still switches the sidebar to Properties (existing behavior), which leaves the chat tab.
- `TemplateCopilot.tsx`: `CopilotKitProvider` gets `enableInspector={false}`, which hides the dev-only CopilotKit Inspector (floating button and chat message shortcuts); an explicit provider value overrides the chat's `inspectorTools`. Not verified (nothing was run).
