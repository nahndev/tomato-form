# Support properties menu with popup mode

## Currently

- The properties menu is one tab of the right sidebar. `ToolbarType.Property` (`Settings2` icon, "Properties" label, `WidgetPropertyBox` component) is registered in `TOOLBAR_REGISTRY` (`website/src/features/template/constants/toolbar/registry.ts`) beside `Widget`, `Structure` and `Version` (see `docs/v1.1.0/group-property-and-toolbar-menu.md`).
- `ToolbarPanel.tsx` (`website/src/features/template/components/toolbar/ToolbarPanel.tsx`) is the only place the menu is rendered. It is a fixed `w-[25em] h-full` flex row, placed after the canvas in `TemplateBuilder.tsx`. It holds the active tab in `useState<ToolbarType>`. `ToolbarContent` (header and tab body) sits beside `ToolbarMenuList` (the vertical icon strip).
- The panel only has a docked layout. The properties menu takes 25em of horizontal space next to the canvas, so the canvas stays narrower while it is shown. There is no popup, floating or detached presentation, and no setting that picks how the menu is displayed.
- `ToolbarPanel` switches to the Properties tab whenever the selected widget id changes (`useWidgetSelection()`). Selecting a widget therefore always shows its properties in the sidebar.
- `WidgetPropertyBox.tsx` and `WidgetPropertyContent.tsx` (`website/src/features/template/components/toolbar/property/`) render the property list inline. Properties are edited as a flat list, driven by `WIDGET_PROPERTY_REGISTRY` and the `setProperty` yjs action.
- Goal: let the properties menu be shown in a popup mode, in addition to the current docked sidebar mode.

## Acceptance Criteria

- [x] ToolbarPanel on right of title, add button icon "mode"
- [x] When click pattern, change mode to popup mode.
- [x] Mode saving for user

## Solutions

- [x] UI add new button
- [x] Using zustand using state and persist for browser
- [x] When click, change state on user
- [x] When popup, using dialog instead pattern

## Changelogs

- Decisions (confirmed with the user): the mode button is in every tab header and popup mode applies to whichever tab is active; the popup is a modal `Dialog` that opens when a widget is selected; the mode is saved per browser (localStorage), not server-side; in popup mode the mode button in the dialog header docks back. (Superseded: the sidebar hint was dropped when `ToolbarPanelWrapper` became a single dialog-or-div component; in popup mode the sidebar shows only the tab icon strip.)
- `website/src/store/toolbar-mode.store.ts`: new zustand store (`ToolbarMode` docked/popup, `useToolbarModeStore`) persisted to localStorage under `tomato:toolbar-mode`, with `skipHydration` to avoid an SSR mismatch.
- `website/src/features/template/components/toolbar/ToolbarPanel.tsx`: new `ToolbarPanelWrapper` takes `<def.Component />` as children from `ToolbarPanel` and adds `ToolbarHeader` (mode `ButtonIcon` on the right of the title); it renders a `Dialog` in popup mode and a docked `div` otherwise. `ToolbarPanel` rehydrates the store on mount, shrinks to the icon strip in popup mode, and opens the dialog from the mode button, widget selection or a tab icon click.
- `packages/icon/src/icons.ts`: added `AppWindow` and `PanelRight` icons for the mode button.
- `docs/WIDGET.md`: documented the mode toggle on `ToolbarPanel.tsx`.
- `website/src/components/ui/dialog.tsx`: `DialogContent` accepts `hideOverlay`; `ToolbarPanelWrapper` uses it so the popup has no overlay.
