# Group TemplateWidgetSelect items of the same widget with expand

## Currently

`TemplateWidgetSelect` (`website/src/features/board/components/display/select/TemplateWidgetSelect.tsx`) lists options grouped by session. Inside a session, a widget that exposes more than one value type (e.g. `datetime` → default / Date / Time) is rendered as several sibling `SelectItem`s, each repeating the widget icon and label and distinguished only by a small badge (e.g. "Date", "Time").

- Items that belong to the same widget are not visually grouped; they appear as separate, repeated rows (same icon, same label), which makes the list longer and harder to scan.
- There is no way to collapse the value-type variants of a widget under a single entry, nor to expand a widget to reveal its variants.

## Acceptance Criteria

- [x] Currently, every group include multiple items with widget + type
- [x] Improve UI for widget has multiple value type
- [x] Every widget into a small group with expand (down icon)
- [x] When click on item, select this item with type is default
- [x] When click on icon, show children with other value types
- [x] Set min width for component with 200px

## Solutions

- Implement base on UI
- Only update UI, don't update backend or structure of data

## Changelogs

- Added `groupWidgetOptions` (`website/src/features/board/utils/widgetOptionGroups.ts`, with unit tests): buckets widgets per session into entries `{ primary, variants }`, where `variants` are the widget's extra value types (e.g. `datetime` → Date / Time) that fit `allowDisplayTypes`.
- `TemplateWidgetSelect` (`website/src/features/board/components/display/select/TemplateWidgetSelect.tsx`) now renders one row per widget. A widget with extra value types gets a chevron `Button` (sibling of the `SelectItem`, `aria-expanded`) that folds its variants as indented rows beneath it; ArrowRight / ArrowLeft on the focused row expand / collapse it. Clicking the row selects its first (default) value type.
- Expand state is derived (`toggled[widgetId] ?? value.widgetId === widget.id`): groups start collapsed except the one holding the current value. Single-value-type widgets stay flat, with a chevron-width spacer to keep alignment.
- `SelectValue` now gets explicit children (icon + label + badge via the shared `OptionLabel`) so the trigger still shows the selected option when its group is collapsed and its item is unmounted.
- Session grouping/labels, the "Select widget" / "No matching widget" item and the `{ widgetId, property }` contract are unchanged.
