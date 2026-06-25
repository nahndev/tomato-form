# Widgets

This folder contains every form-field "widget" type as a self-contained
plugin. `registry.ts` is the single source of truth consumed by:

- the widget picker sidebar (`WidgetPicker.tsx`)
- the builder canvas preview (`WidgetItem.tsx`)
- the properties panel (`WidgetPropertiesPanel.tsx`)
- the submission fill-out page (`app/(main)/boards/[id]/submissions/[submissionId]/page.tsx`)
- the "add widget" handler (`template/TemplateBuilder.tsx`)

## Folder layout

```
widget/
  types.ts             # WidgetDefinition, FieldComponentProps, FieldMode
  registry.ts           # WIDGET_REGISTRY: Record<WidgetType, WidgetDefinition>
  shared/                # small components reused by more than one widget
  <type>/
    Field.tsx             # required
    defaults.ts            # required: DEFAULT_SETTINGS, DEFAULT_LAYOUT
    SettingsFields.tsx     # optional: extra properties-panel fields
```

## Required exports

### `Field.tsx`

A single component implementing:

```ts
interface FieldComponentProps<TValue = unknown> {
  widgetId: string;
  properties: WidgetProperties;
  mode: "fill" | "preview";
  value?: TValue;
  onChange?: (value: TValue) => void;
}
```

- In `mode="fill"`: render the real interactive control and call `onChange`
  on every user edit. This is what the submission-fill page renders.
- In `mode="preview"`: render a static, non-interactive placeholder that
  looks like the real thing. This is what the builder canvas renders. Never
  wire real event handlers in preview mode.
- If the widget never collects an end-user value (visual or action-only -
  e.g. `break`, `label`, `button`, `session`), never call `onChange` and
  ignore `value`.

### `defaults.ts`

```ts
export const DEFAULT_SETTINGS: WidgetProperties = { label: "...", ... };
export const DEFAULT_LAYOUT: Omit<GridLayout, "idx"> = { column: 0, span: 2 };
```

`idx` is intentionally omitted - it is always computed at insertion time
from sibling widgets via `generateKeyBetween` (see
`TemplateBuilder.handleAddWidget`).

### `SettingsFields.tsx` (optional)

Only needed if the widget has properties beyond the common
label/placeholder/required (e.g. an options list for select/checkbox/radio,
a content textarea for `label`, or a URL field for `button`). It receives
`{ value: WidgetProperties, onChange: (patch: Partial<WidgetProperties>) => void }`
and is responsible for its own auto-save-on-blur - it is rendered
independently from the common fields' form. Reuse the building blocks in
`shared/SettingsFields.tsx` (`OptionsListEditor`, `ContentEditor`, `UrlField`)
where they fit.

## Registering a new widget

1. Add the new id to the `WidgetType` union in `src/types/template.ts`.
2. Create `widget/<type>/Field.tsx` and `widget/<type>/defaults.ts`
   (+ `SettingsFields.tsx` if needed).
3. In `registry.ts`, import them and add one entry to `WIDGET_REGISTRY`:

```ts
import { Field as RatingField } from "./rating/Field";
import * as ratingDefaults from "./rating/defaults";

// inside WIDGET_REGISTRY = { ... }
rating: {
  type: "rating",
  label: "Rating",
  icon: Star,
  description: "1-5 star rating",
  isDataField: true,
  Field: RatingField as WidgetDefinition["Field"],
  defaultSettings: ratingDefaults.DEFAULT_SETTINGS,
  defaultLayout: ratingDefaults.DEFAULT_LAYOUT,
},
```

That's it - the picker, canvas preview, properties panel, fill page, and
"add widget" button all pick this up automatically. `WIDGET_REGISTRY` is
typed as `Record<WidgetType, WidgetDefinition>`, so forgetting step 3 is a
TypeScript compile error, not a silent runtime gap.

## Notes / known limitations

- `datetime`'s value is an epoch in **milliseconds** (`Date.getTime()`), not
  seconds. The native `<input type="datetime-local">` has no timezone of its
  own, so the browser's local timezone is used implicitly when converting.
- `image-uploader` and `file-uploader` have no backend upload endpoint to
  talk to (none exists yet in `server/src`). Values are kept client-side
  only - a base64 data URL for the selected image, bare file metadata
  (name/size/type, no content) for files - purely for demo purposes. A
  future task needs to add a real upload endpoint and switch these widgets
  to upload-then-store-URL.
