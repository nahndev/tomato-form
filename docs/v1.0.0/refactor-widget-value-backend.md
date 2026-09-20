# Refactor widget value handling on backend (server)

## Currently

- A widget's submitted value is untyped end-to-end on the server: `CreateSubmissionDto.data`
  and `Submission.data` are `Record<string, unknown>`, and `SubmissionValueEntry.value`
  (in `submission-value.contract.ts`, the RabbitMQ event synced from `yjs-server`) is `unknown`.
- Because there's no shared per-widget-type value contract, each consumer re-derives its own
  notion of "what shape is this widget's value" independently:
  - `display/mappers/*` (`date`, `entity`, `text`, `un-support`) map `DisplayMapperSubmission.data[widgetId]`
    per widget type for the submission-display doc.
  - `search/widget-mapper/mappers/*` (`date`, `tag`, `text`) map the same raw value per widget
    type again, separately, for the search index doc.
  - Neither shares types or parsing logic with the other, so a widget's value shape (e.g.
    `datetime` = epoch ms, `select`/`checkbox` = tag ids) is implicitly duplicated knowledge
    across both mapper families and the DTOs.
- No validation exists on the server for a widget value against its widget type - `data` is
  accepted as opaque `unknown` and only class-validated as "is an object", not against the
  widget's expected value shape.
- Goal: introduce a single, typed, per-widget-type value contract on the server so
  `display` mappers, `search` widget-mappers, and submission DTOs/services all validate and
  read widget values through the same shape instead of duplicating widget-type-specific
  assumptions about `unknown`.

## Solution for backend

- [x] Create factory base on widget-type return

Example for Datetime

```ts
interface WidgetValueInterface {
  validate(json: unknown): boolean;
  getMapped(json: T): Record<string, Record<DisplayType, unknown>>;
}

interface ValueInterface {
  getMapped(json: T): Record<DisplayType, unknown>;
}

class DateValue implements ValueInterface {
  getMapped(json: Date) {
    return {
      [DisplayType.Date]: json.getTime(),
      [DisplayType.TIME]: json......
      [DisplayType.TEXT]: json......
    }
  }
}

interface DateValueInterface {
  getDateValue(): DateValue;
}

interface TimeValueInterface {
  getTimeValue(): TimeValue;
}

class DatetimeWidgetValue implements WidgetValueInterface, DateValueInterface, TimeValueInterface {
  getMapped(...): ...
  validate(...): ...
  getDateValue(...): ...
  getTimeValue(...): ...
}
```

- [x] Every widget will implements `WidgetValueInterface` and multiple others `ValueInterface`
- [x] ValueInterface include `TextValue`, `DateValue`, `TimeValue`, `DateTimeValue`, ...
- [x] Update SubmissionDisplayService::buildDisplayDoc using new pattern

## Solution for front-end

- [ ] Update `WIDGET_VALUE_PROPERTY_REGISTRY` using new constants `ValueType`
- [ ] New `ValueType` same with `ValueInterface`, every `ValueInterface` with exist a `ValueType`
- [ ] Update `WIDGET_VALUE_REGISTRY`, every `WidgetType` include multiple `ValueType` (remove `DisplayType`)
- [ ] Add new `VALUE_DISPLAY_REGISTRY`, every `ValueType` include multiple `DisplayType`
- [ ] Update all other UI

## Changelogs

- `server/src/widget-value/` (new module): the single, shared per-widget-type value contract.
  - `widget-value.types.ts`: `WIDGET_TYPE`/`DISPLAY_TYPE`/`VALUE_TYPE` constants (moved here from `display/display-mapper.types.ts`, now the one place that owns them; `VALUE_PROPERTY` was renamed to `VALUE_TYPE`), plus `ValueInterface` (one value-property's `getMapped(value): ValueMap` - resolves a raw value into every `DisplayType` bucket it supports), `WidgetValueInterface` (`validate(value): boolean` + `map(context: MappingContext, widget: Widget): void`, writing every value-property the widget type exposes onto `context`), and `DateValueInterface`/`TimeValueInterface` (exposed by a widget-value class with an extra `date`/`time` property, e.g. `datetime`).
  - `mapping-context.ts` (new): `MappingContext` - constructed from a `{ data }` source, it's threaded through `WidgetValueInterface.map()` so a widget-value class can read its own raw value (`getRaw(widgetId)`) and write its resolved value-properties (`setMapped(widget, mapped)`) without knowing the `${widgetId}:${valueType}` doc-key format itself; `getDoc()` returns the accumulated doc once every widget has mapped. This replaced an earlier version of `WidgetValueInterface` where `getMapped(value)` returned `Record<valueType, ValueMap>` for the caller to merge - moving the merge into `map`/`MappingContext` means each widget-value class fully owns writing its own entries, and callers (`display`, and later `search`) just iterate widgets and call `.map()`.
  - `values/text.value.ts`, `values/entity.value.ts`, `values/date.value.ts`: `TextValue`, `EntityValue`, and the date family (`DateValue`, `TimeValue`, `DateTimeValue`, sharing a `BaseDateValue` that resolves the epoch-ms timestamp and defers only the `.text` formatting to each subclass) - same resolution logic the old `display/mappers/*` had, extracted into standalone, reusable `ValueInterface`s.
  - `widgets/text.widget-value.ts`, `widgets/entity.widget-value.ts`, `widgets/date.widget-value.ts`: one `WidgetValueInterface` per widget type (`TextWidgetValue`/`TextAreaWidgetValue`, `SelectWidgetValue`/`CheckboxWidgetValue`/`RadioWidgetValue`/`UsersWidgetValue`/`SubmittedByWidgetValue`, `DateWidgetValue`/`TimeWidgetValue`/`CreatedAtWidgetValue`/`DatetimeWidgetValue`), each `validate`-ing its raw value's shape and `map`-ping its `ValueInterface`(s) onto the `MappingContext`. `DatetimeWidgetValue` is the only multi-property one, implementing `DateValueInterface`/`TimeValueInterface` and writing `default`/`date`/`time` entries in one `map()` call.
  - `widgets/un-support.widget-value.ts`: `UnSupportWidgetValue` - fallback for an unregistered widget type, same string coercion as `TextWidgetValue`.
  - `widget-value.factory.ts`: `WidgetValueFactory.getValue(widgetType): WidgetValueInterface` - the factory the ticket asked for. Registers the same widget types the old `DisplayMapperFactory` did; an unregistered type falls back to `UnSupportWidgetValue`, same as the pre-refactor `DisplayMapperFactory`.
  - Behavior change: `TimeValue`'s `.text` now formats with `toLocaleTimeString()` and `DatetimeWidgetValue`'s `default` property with `toLocaleString()`, instead of every date-family property using `toLocaleDateString()` like the old mappers did. Introducing `TimeValue`/`DateTimeValue` as their own `ValueInterface`s (as the ticket's example asks for) only makes sense if they format differently from `DateValue` - otherwise they'd be the same duplicated logic the ticket is trying to remove.
- `server/src/display/`: rewired onto the new contract.
  - `display-mapper.types.ts` → `display.types.ts`: trimmed to just the doc shape (`SubmissionDisplayValue`, `SubmissionDisplayDoc`, `DisplaySubmission` - renamed from `DisplayMapperSubmission`); `WIDGET_TYPE`/`DISPLAY_TYPE`/`VALUE_TYPE` and the mapper interfaces moved to/replaced by `widget-value`. `DisplayMapperContext` was dropped - nothing needed the full `{ submission, snapshot }` context once mapping no longer happens per-mapper-class (its replacement, `MappingContext`, lives in `widget-value` instead, since it's now part of the shared contract, not a display-only concept).
  - `display-mapper.factory.ts`, `mappers/date.mapper.ts`, `mappers/entity.mapper.ts`, `mappers/text.mapper.ts`, `mappers/un-support.mapper.ts` (deleted): superseded by `widget-value`'s factory/value classes.
  - `submission-display.service.ts`: `buildDisplayDoc` now builds a `MappingContext` from the submission, calls `WidgetValueFactory.getValue(widget.type).map(context, widget)` per widget, and returns `context.getDoc()` - instead of merging a returned record itself or going through the old `DisplayMapperInterface.map(doc, widget, context)`. Also dropped a stray `console.log(snapshot)` left in the method being rewritten.
  - Note on the fallback: the pre-refactor `DisplayMapperFactory.getMapper` always fell back to `new UnSupportMapper()` for an unregistered widget type, which actually contradicted `display-mapper.factory.spec.ts`/`submission-display.service.spec.ts`'s "skips a widget whose type isn't displayable yet" tests (documented in `docs/v1.0.0/add-column-cell-property.md`'s changelog as a known, left-as-is test failure). This refactor initially made `getValue` return `undefined` and skip those widgets, to match what the tests asserted - but the fallback-to-text behavior turned out to be the intended one, so `UnSupportWidgetValue` restores it and the two tests were updated to assert the fallback instead (`"falls back to string coercion ..."`), rather than the skip-behavior they used to (wrongly) assert.
- Tests: `server/src/widget-value/widget-value.factory.spec.ts` (new) covers `validate`/`map` (via a real `MappingContext`) for every registered widget type plus the `UnSupportWidgetValue` fallback; `server/src/display/submission-display.service.spec.ts` needed no changes - `buildDisplayDoc`'s public input/output shape is unchanged, only its internals were rewired. Two pre-existing, unrelated failures in `server/src/submission/submission.service.spec.ts` (`applyValuesChangedEvent`'s clock-merge logic) were confirmed present on `main` before this change (via `git stash`) and left as-is - out of scope for this ticket.
- Out of scope (per the backend checklist above, not the "Currently" section's broader framing): `search/widget-mapper/*` still has its own hand-mirrored `WIDGET_TYPE` and per-widget mappers, unchanged; `CreateSubmissionDto.data`/`Submission.data`/`SubmissionValueEntry.value` are still `unknown`/`Record<string, unknown>`, and nothing wires `WidgetValueInterface.validate()` into the submission create/sync flow yet. `validate()` exists on every widget-value class and is ready to be wired in, but doing so needs the template snapshot at validation time (which DTO-level `class-validator` doesn't have access to - it would need to happen in `SubmissionService`), which the checklist didn't call for. Flagging as a natural follow-up.
