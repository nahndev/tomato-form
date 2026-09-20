# Improve UI for TemplateWidgetSelect

## Currently

`TemplateWidgetSelect` (`website/src/features/board/components/display/select/TemplateWidgetSelect.tsx`) renders a single flat `shadcn/ui` `Select` per linked template, listing every widget + value-type combination as one flat list of items (e.g. "Meeting time", "Meeting time as Date", "Meeting time as Time").

- All options are flattened into one list with no grouping by widget, so a widget exposing multiple value types (e.g. `datetime`) shows as multiple visually unrelated entries with only a text suffix ("... as Date") distinguishing them.
- The trigger has no icon/affordance indicating widget type.
- When there are no matching widgets, the select is disabled and shows a static "No matching widget" placeholder item — no additional guidance is given to the user.
- Long widget/template names have no visible truncation or overflow handling defined in this component.

## Acceptance Criteria

- [x] Group all items with SessionName
- [x] Update UI for content `SelectItem`
- [x] UI should with widget name and as type difference

## Solutions

- [x] List item with group by `session`
- [x] Update UI for item with 2 path <widget-name> <as type>
- [x] Add more padding and align

## Changelogs

- `TemplateWidgetSelect` (`website/src/features/board/components/display/select/TemplateWidgetSelect.tsx`) now groups options into a `SelectGroup`/`SelectLabel` per session (falling back to an "Other" bucket for widgets not placed in any session), separated by `SelectSeparator`; group labels are only rendered when a template has more than one bucket, so simple single-session templates stay flat.
- Each `SelectItem` now renders the widget-type icon (from `WidgetItems[widget.type].icon`), the widget's own label (`truncate` + `title` for overflow), and, for non-default value types, a small muted uppercase badge (e.g. "Date"/"Time") instead of concatenating it into the label text (e.g. "Meeting time as Date").
- Removed `getWidgetOptionLabel` (`website/src/features/board/utils/boardColumnWidgets.ts`), which built the old flattened `session/widget` label string — no longer needed now that grouping conveys the session and the widget label is rendered directly.
