# Support choice value type is text for select and checkbox

## Currently

- Choice widgets (`select`, `checkbox`) store the selected option **`key`** (a stable identifier), not the displayed text: `SelectWidgetItem` value is `string`, `CheckboxWidgetItem` value is `string[]` (`website/src/features/template/components/widget/items/`). The display text lives in `WidgetProperties.options` as `OptionItem { key, value, index }` (`website/src/types/template.ts`), see `docs/v1.0.0/improve-choice-settings-ui.md`.
- Frontend `WIDGET_VALUE_TYPE_REGISTRY` (`website/src/features/board/constants/column/valueTypes.ts`) exposes only the `default` value type for `select` and `checkbox` (and `radio`), rendered as `DisplayType.TEXT`. `ValueType` currently only has `default`, `date`, `time`; there is no `text` value type, and `VALUE_TYPE_LABELS` has no entry for it.
- Backend `SelectWidgetValue` / `CheckboxWidgetValue` (`server/src/widget-value/widgets/entity.widget-value.ts`) extend `EntityWidgetValue`, which maps only `VALUE_TYPE.DEFAULT` through `EntityValue` (`values/entity.value.ts`). `EntityValue` stringifies the raw value(s) (the option keys) into the `entity` bucket and has no access to the widget's `options`, so it cannot resolve a key into its option `value` text. The backend `VALUE_TYPE` (`widget-value.types.ts`) is hand-mirrored from the frontend and also has only `default`/`date`/`time`.
- Result: on a board column, a `select`/`checkbox` widget can only show the stored option key(s) via `default`; there is no way to pick the human-readable option text as the column's value type.
- Out of scope for this ticket's title: `radio` and `users`/`submitted-by` share `EntityWidgetValue` but are not named here.

## Acceptance Criteria

- [x] For selector and choice (`select`, `checkbox`, `radio`) add new WidgetValueInterface
- [x] For generate, base on setting -> generate into text for display
- [x] For multiple value, split by comma (`", "`)

## Solutions

- [x] Update backend mapper for value: `ChoiceWidgetValue` (`widgets/choice.widget-value.ts`) keeps a single `default` value type, resolved through `ChoiceValue` (`values/choice.value.ts`), which maps into both `DISPLAY_TYPE.ENTITY` (option keys) and `DISPLAY_TYPE.TEXT` (option text via `widget.options`)
- [x] No new value type: a board column on a choice widget picks `DisplayType.TEXT` from the existing `default` value type and reads the `text` bucket
- [x] Keys with no matching option are skipped (empty string when none match / no value / no options); selection order is kept; multiple values joined by `", "`
- [x] Tests: `widget-value.factory.spec.ts`

## Changelogs

- `server/src/widget-value/values/choice.value.ts` (new): `ChoiceValue` (+ `CHOICE_TEXT_SEPARATOR`) returns `{ entity: keys, text: "A, B" }`; reuses `EntityValue` for the `entity` bucket.
- `server/src/widget-value/widgets/choice.widget-value.ts` (new): `ChoiceWidgetValue` (+ `Select`/`Checkbox`/`RadioWidgetValue`, moved out of `entity.widget-value.ts`) maps only `default`, through `ChoiceValue`. `EntityWidgetValue` now only serves `users`/`submitted-by`.
- An earlier iteration added a separate `text` value type (`VALUE_TYPE.TEXT`, `ValueProperty`/`ValuePropertyDto`, frontend `ValueType.TEXT`, `TextValueInterface`); it was removed in favour of the single `default` value type above.
- `server/src/widget-value/widget-value.factory.spec.ts`: fixed `getMappedDoc` (missing required `meta`) so the suite compiles again. Pre-existing and unrelated, still failing: `created-at` null test (reads `meta.createdAt`, not the raw value), `submission.service.spec.ts`, and `display/submission-display.service.spec.ts` (type errors).
