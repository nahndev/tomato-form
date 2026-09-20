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

- [ ] Create factory base on widget-type return

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

- [ ] Every widget will implements `WidgetValueInterface` and multiple others `ValueInterface`
- [ ] ValueInterface include `TextValue`, `DateValue`, `TimeValue`, `DateTimeValue`, ...
- [ ] Update SubmissionDisplayService::buildDisplayDoc using new pattern

## Solution for front-end

- [ ] Update `WIDGET_VALUE_PROPERTY_REGISTRY` using new constants `ValueType`
- [ ] New `ValueType` same with `ValueInterface`, every `ValueInterface` with exist a `ValueType`
- [ ] Update `WIDGET_VALUE_REGISTRY`, every `WidgetType` include multiple `ValueType` (remove `DisplayType`)
- [ ] Add new `VALUE_DISPLAY_REGISTRY`, every `ValueType` include multiple `DisplayType`
- [ ] Update all other UI
