# Group properties menu and other menu into a group

## Currently

- `TemplateBuilder.tsx` (`website/src/features/template/components/TemplateBuilder.tsx:14-21`) renders two independent panels on opposite sides of the canvas inside one flex-row: `WidgetPropertyPanel` on the left, `TemplateCanvas` in the middle (`flex-1`), and `ToolbarPanel` on the right.
- The properties menu is a separate panel. `WidgetPropertyPanel.tsx` (`website/src/features/template/components/toolbar/property/WidgetPropertyPanel.tsx`) keeps its own `open` state and has its own icon strip with a single `Settings2` toggle button. When open it shows a "Properties" header and `WidgetPropertyBox`, 25em wide.
- The other menus form a second, separate group. `ToolbarPanel.tsx` (`website/src/features/template/components/toolbar/ToolbarPanel.tsx`) holds the active tab in `useState<ToolbarType>`. It renders `ToolbarContent` (header and active tab body) beside `ToolbarMenuList`, a vertical icon strip built from `TOOLBAR_REGISTRY`.
- `TOOLBAR_REGISTRY` (`website/src/features/template/constants/toolbar/registry.ts`) only contains `Widget`, `Structure` and `Version`. `ToolbarType.Property` was removed when the property menu moved to the left (see `docs/v1.0.0/move-widget-property-menu-to-left.md`).
- As a result the menus are split into two groups that don't know about each other:
  - Two icon strips, one on each outer edge of the screen, each with its own active/inactive styling.
  - Two independent open/active states, so the properties panel and a right-hand tab can be open at the same time. Each takes 25em, which leaves the canvas narrower.
  - The menu registry, the panel layout and the header markup are duplicated between `WidgetPropertyPanel` and `ToolbarPanel`.
- Goal: treat the properties menu and the other menus (Widget, Structure, Version) as one menu group instead of two separate panels.

## Acceptance Criteria

- [x] Merge all menu into right sidebar

## Solutions

- [x] Move properties menu into right sidebar
- [x] Cleanup code

## Changelogs

- `website/src/features/template/constants/toolbar/registry.ts`: re-added `ToolbarType.Property` (between Structure and Version) with the `Settings2` icon, "Properties" label and `WidgetPropertyBox` component, so the property menu is one of the tabs in `TOOLBAR_REGISTRY` again.
- `website/src/features/template/components/toolbar/ToolbarPanel.tsx`: now reads `useWidgetSelection()` and switches to the Properties tab whenever the selected widget id changes, which keeps the "auto open on selection" behaviour of the old left panel.
- `website/src/features/template/components/toolbar/property/WidgetPropertyPanel.tsx`: deleted.
- `website/src/features/template/components/TemplateBuilder.tsx`: removed `WidgetPropertyPanel`, leaving the canvas and the right-hand `ToolbarPanel`.
- `docs/WIDGET.md`: removed `WidgetPropertyPanel.tsx` and documented `ToolbarPanel.tsx` with its four tabs.
