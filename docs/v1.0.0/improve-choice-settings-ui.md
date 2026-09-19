# Improve setting UI of choice components

## Currently

- Currently, the setting using `OptionsDescriptor` using `textarea`.
- When change text, the `value` changed, old choice removed.
- Now, we will improve them

## Acceptance Criteria

- [x] Update setting UI to list
- [x] Support drag and drop
- [x] Allow update description without label

## Solutions

- [x] Update UI to: <drag-icon> <text input> <action icons>
- [x] Using Dnd allow drag and drop, using index with ``fractional-indexing`
- [x] Save setting with `key:value`
- [x] Update `OptionsDescriptor`
- [x] Base on `./website/src/features/template/components/property/registry.ts` and `OPTIONS` -> list and update components

## Changelogs

- Added `OptionItem { key, value, index }` to `WidgetProperties.options` (was `string[]`) in `website/src/types/template.ts` and mirrored in `server/src/template/template.types.ts`. `key` is the stable identifier stored in submission answers; `value` is the freely-editable display text, so retyping an option no longer orphans existing answers.
- Rewrote `OptionsDescriptor` as a drag-and-drop list (`@dnd-kit/react` + `@dnd-kit/react/sortable`), one row per option with a drag handle, text input, and remove button. Reordering computes a new `index` for only the moved item via `fractional-indexing`'s `generateKeyBetween`.
- Updated `SelectWidgetItem`, `RadioWidgetItem`, `CheckboxWidgetItem` to store/compare by `option.key` and render `option.value`, sorted by `index`.
- Updated `DEFAULT_SETTINGS` (select/checkbox/radio) to seed options in the new shape.
- Added `fractional-indexing` as a direct dependency of `website` (already used the same way in `packages/grid`) and allow-listed it in Jest's `transformIgnorePatterns` (it ships ESM-only).
