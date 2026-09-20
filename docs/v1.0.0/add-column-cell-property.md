# Add property (this is of value from widget, don't property of widget) for column cell

## Currently

- `BoardColumnCell` (`website/src/features/board/components/submission/BoardColumnCell.tsx`) renders a cell purely off `column.type` (a `DisplayType`): it looks up an icon from `DISPLAY_TYPE_REGISTRY` and a formatting component from `DISPLAY_VALUE_REGISTRY` (`TextValue` / `DateValue` / `NumberValue` / `UnknownValue`, under `features/board/components/submission/display/`). Each of those components only receives `SubmissionDisplayValue` (`display/types.ts`) — no per-column configuration is passed in.
- `BoardColumn` (`website/src/types/board.ts`) is `{ id, type, size, label, items: Record<templateId, widgetId> }` — there is no `properties`/config field. A column's appearance is entirely derived from the source widget picked into it (`items`) plus the fixed `DisplayType` formatter; it does not carry any settings of its own.
- The formatting is hardcoded per `DisplayType`: `DateValue` always uses `toLocaleDateString()`, `NumberValue` always uses `toLocaleString()`, `TextValue` joins array entities with `", "` — none of this is configurable per column (e.g. no custom date format, decimal precision, prefix/suffix, or truncation length).
- The column config UI, `BoardSettingColumn` (`website/src/features/board/components/display/BoardSettingColumn.tsx`), only exposes: label (text input), size (`ColumnSizeSelect`), display type (`ColumnDisplayTypeSelect`), and a per-template widget picker (`TemplateWidgetSelect`). There is no property editor for the column/cell itself.
- This is unlike widgets in the template builder, which already have a property system to build on: `WIDGET_PROPERTY_REGISTRY` (`website/src/features/template/components/property/registry.ts`) maps each `WidgetType` to a list of `WidgetPropertyKey`s, and `PROPERTY_DESCRIPTOR_REGISTRY` (`components/property/descriptors/registry.ts`) resolves each key to a `{ label, Component }` descriptor (see `docs/WIDGET.md` and `docs/v1.0.0/refactor-property-registry-constant.md`).
- Backend: `Board.columns` (`server/src/database/schema.prisma`) is stored as an untyped `Json` column, so whatever shape `BoardColumn[]` serializes to is persisted as-is — no schema migration is required just to add a new field to the column shape.

## Acceptance Criteria

- [x] `BoardColumnCell` should display widget with display property (One widget came multiple options)
- [x] UI should update for board setting
- [x] UI should update for board display (with submission)

## Solutions

- [x] Add new constant for properties of value-widget (difference with property of setting)
- Ex: Widget text has `default` property, `datetime` widget has `default` and `date` and `time`
- [x] Widget instead of using id, update to `{ widgetId, property }` (kept as separate fields rather than a joined `widgetId:property` string, so each stays independently searchable)
- [x] Currently, displayType base on widget (1 widget has multiple display type) -> update displayType base on property of widget-value -> `WIDGET_VALUE_PROPERTY_REGISTRY: Record<WidgetType, Partial<Record<ValueProperty, DisplayType[]>>>` (one nested registry rather than two chained flat maps, since a flat `Map<Property, DisplayType>` isn't well-defined - `default` means TEXT for a text widget but NUMBER for a number widget)
- [x] Update board, cell base on new property
- [ ] Remove all board in database (destructive - hand off to the human, see Changelogs)
- [x] Update UI of column design
- [x] Update UI of column display
- [x] Update `/server/src/display/mappers` with display properties for every widget (using constants)
- [x] New format should is doc[<widget.id>:<property>] = {[this.displayType]: resolved } (implemented on the backend `dataDisplays` cache; `BoardColumn.items` itself stays a `{ widgetId, property }` object, not a joined string)

## Changelogs

- `server/src/display/display-mapper.types.ts`: added `VALUE_PROPERTY`/`ValueProperty` (hand-mirrored from the frontend, same convention as `BoardColumnDisplayTypeDto`); `SubmissionDisplayDoc` keys are now `widgetId:property` compound strings instead of bare widget ids.
- `server/src/display/mappers/default.mapper.ts`: `DefaultMapper` gained an overridable `properties` list (defaults to `[default]`) and an overridable `buildValue` (defaults to one bucket); `map()` now writes one doc entry per property.
- `server/src/display/mappers/date.mapper.ts`: `DateMapper.buildValue` now always populates both `.date` and `.text` buckets, since every date-family property allows rendering as `TEXT` too - a chosen `DisplayType` should never render blank. `DatetimeWidgetDisplayMapper` overrides `properties` to `[default, date, time]`, fanning out into three doc entries carrying the same resolved value (per-entry formatting is a frontend concern).
- `server/src/board/dto/board-column.dto.ts`: `BoardColumnDisplayTypeDto` gained `TIME`/`DATETIME`; added `ValuePropertyDto` and `BoardColumnItemDto`; `IsBoardColumnItemsConstraint` now validates each `items` value as `{ widgetId, property }` instead of a bare string.
- `server/src/board/board.types.ts`: `BoardColumn.items` is now `Record<string, { widgetId, property }>`; `BoardColumnDisplayType` gained `time`/`datetime`.
- `website/src/types/display-type.ts`: `DisplayType` gained `TIME`/`DATETIME` as first-class members, so formatting is fully determined by which `DisplayType` a property allows - no separate (widgetType, property) -> format side-registry needed.
- `website/src/features/template/constants/widget/displayTypes.ts`: added `DISPLAY_TYPE_REGISTRY` entries for `TIME`/`DATETIME`; removed `WIDGET_DISPLAY_TYPE_REGISTRY` (superseded by `valueProperties.ts`).
- `website/src/features/template/constants/widget/valueProperties.ts` (new): `ValueProperty`, `WIDGET_VALUE_PROPERTY_REGISTRY`, `getWidgetValueProperties`/`getPropertyDisplayTypes`/`getWidgetDisplayTypes`, `VALUE_PROPERTY_LABELS`. Only `datetime` has more than one property; `NUMBER`'s old "view as text" option was dropped, while `DATE`/`TIME`/`CREATED_AT` keep (or regain) a `TEXT` fallback option alongside their natural type.
- `website/src/features/board/components/submission/display/TimeValue.tsx`, `DateTimeValue.tsx` (new): render components for the two new `DisplayType`s, modeled on `DateValue.tsx` with `toLocaleTimeString()`/`toLocaleString()`.
- `website/src/features/board/components/submission/display/registry.ts`: `DISPLAY_VALUE_REGISTRY` wired to the two new components.
- `website/src/types/board.ts`: added `BoardColumnItem { widgetId, property }`; `BoardColumn.items` is now `Record<string, BoardColumnItem>`.
- `website/src/features/board/utils/column.ts` (`JsonColumn`): added `getItem`/`getItemProperty`; `getItemWidgetId`/`setItem` updated for the object shape.
- `website/src/features/board/utils/boardColumnWidgets.ts`: `getDataFieldWidgets` sourced from `getWidgetDisplayTypes`; `getSelectedColumnWidgets` renamed to `getSelectedColumnItems`, now also resolving/returning each item's `property`.
- `website/src/features/board/utils/displayTypeHelper.ts`: `getCommonDisplayTypes` now takes `{ widgetType, property }` entries and intersects `getPropertyDisplayTypes`, instead of intersecting a widget's full type list.
- `website/src/features/board/hooks/useTemplateWidgetsByDisplayTypes.ts`: sourced from `getWidgetDisplayTypes` instead of the removed registry.
- `website/src/features/board/utils/submission.ts` (`JsonSubmission.getDisplayValue`): looks up `dataDisplays` by the `widgetId:property` compound key built from the column's item, instead of a bare widget id.
- `website/src/features/board/components/display/select/TemplateWidgetSelect.tsx`: `value`/`onChange` now operate on `BoardColumnItem | null`; renders a second inline property picker only when the selected widget exposes more than one value-property (today, only `datetime`).
- `website/src/features/board/components/display/BoardSettingColumn.tsx`: updated for the renamed/reshaped helpers above; `ColumnDisplayTypeSelect`'s `allowedTypes` now derives from the column's selected `(widgetType, property)` pairs rather than raw widget types.
- Tests: `server/src/board/dto/board-column.dto.spec.ts`, `server/src/display/display-mapper.factory.spec.ts`, `server/src/display/submission-display.service.spec.ts` updated for the compound-key/multi-bucket/multi-property shapes; `website/src/features/board/utils/column.test.ts` extended with item accessor round-trips; new `website/src/features/board/utils/displayTypeHelper.test.ts` and `submission.test.ts`; `website/src/features/board/testing/board.factory.ts` gained a `getMockSubmission` factory. Two pre-existing, unrelated test failures (`display-mapper.factory.spec.ts` and `submission-display.service.spec.ts` each have one test asserting a fallback-mapper behavior that already contradicted the actual factory code before this change) were left as-is, unchanged by this work.
- DB wipe: old-shape data (bare-widgetId `items`, bare-widgetId `dataDisplays` keys) has no migration path and is unparseable by the new code. Run this once, before testing the new column UI against existing data:
  ```bash
  cd server && set -a && source .env && set +a && \
    psql "$DATABASE_URL" -c 'TRUNCATE TABLE "submissions", "boards" CASCADE;'
  ```
