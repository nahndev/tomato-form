# Move widget property menu to the left of the template builder

## Currently

- `TemplateBuilder.tsx` (`website/src/features/template/components/TemplateBuilder.tsx:14-21`) lays the page out as a single flex-row: the session canvas fills the left/main area (`flex-1`, `TemplateCanvas`), and a single 25em-wide `ToolbarPanel` occupies the entire right edge of the screen.
- `ToolbarPanel.tsx` (`website/src/features/template/components/toolbar/ToolbarPanel.tsx:12-22`) is itself a flex-row: the active tab's content (`ToolbarContent`) renders on the inner-left, and a vertical strip of icon buttons (`ToolbarMenuList`) that switches between tabs renders on the inner-right - making it the right-most element on the page.
- The tab registry (`website/src/features/template/constants/toolbar/registry.ts:8-40`, `ToolbarType` enum: `Widget`, `Structure`, `Property`, `Version`) wires the Property tab to `WidgetPropertyBox`, so today the property menu is just one of four tabs - Widget picker, Structure, Property, Version - all sharing this same right-hand `ToolbarPanel` and icon menu (`ToolbarMenuList`).
- The property panel itself: `WidgetPropertyBox.tsx` shows a placeholder when nothing is selected, otherwise renders `WidgetPropertyContent.tsx` (`website/src/features/template/components/toolbar/property/`), which looks up `WIDGET_PROPERTY_REGISTRY[widget.type]` (`website/src/features/template/components/property/registry.ts`) and renders each field's editor from `PROPERTY_DESCRIPTOR_REGISTRY` (`website/src/features/template/components/property/descriptors/registry.ts`), wiring changes through `useWidgetActions().setProperty`.
- There is currently no panel of any kind on the left side of the canvas - `TemplateCanvas.tsx` only renders the scrollable list of sessions/widgets.
- Moving the property menu "to the left" means pulling it out of the shared right-hand `ToolbarPanel` into its own panel on the opposite side of the canvas, while the icon `ToolbarMenuList` ("same other menu") and the remaining Widget/Structure/Version tabs continue to live on the right exactly as before.

## Acceptance Criteria

- [x] Left menu group for `WidgetProperty`
- [x] Menu auto open when exist property selector

## Solutions

- [x] Remove `ToolbarType.Property` from the shared right-hand `TOOLBAR_REGISTRY` - the property
      tab no longer lives in `ToolbarPanel`/`ToolbarMenuList`
- [x] Add `WidgetPropertyPanel.tsx` - a standalone panel mirroring `ToolbarPanel`'s
      content/icon-strip layout, but flipped (icon strip on the outer-left edge, content
      adjacent to the canvas) and rendered on the opposite side of `TemplateBuilder`
- [x] Auto-open: `WidgetPropertyPanel` reads `useWidgetSelection()` and opens itself whenever a
      widget becomes selected, while still letting the user manually collapse/expand it via the
      icon button
- [x] Wire `WidgetPropertyPanel` into `TemplateBuilder.tsx` on the left of `TemplateCanvas`

## Changelogs

- `website/src/features/template/constants/toolbar/registry.ts`: removed `ToolbarType.Property`
  and its `WidgetPropertyBox` entry from `TOOLBAR_REGISTRY` - the right-hand `ToolbarPanel` now
  only has Widget/Structure/Version tabs.
- `website/src/features/template/components/toolbar/property/WidgetPropertyPanel.tsx` (new):
  standalone left-hand panel. Renders an icon-strip toggle (Settings2) plus the existing
  `WidgetPropertyBox` content; auto-opens (`useEffect` on `selected?.id`) whenever
  `useWidgetSelection()` reports a selected widget, and can be manually toggled otherwise.
- `website/src/features/template/components/TemplateBuilder.tsx`: renders `WidgetPropertyPanel`
  as the left-most element, before `TemplateCanvas`; `ToolbarPanel` stays on the right, unchanged.
- `docs/WIDGET.md`: documented the new `WidgetPropertyPanel.tsx` file under
  `components/toolbar/`.
