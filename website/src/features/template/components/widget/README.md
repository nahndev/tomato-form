# Widgets

This folder contains every form-field "widget" type as a self-contained
plugin. `registry.ts` is the single source of truth consumed by:

- the widget picker sidebar (`WidgetPicker.tsx`)
- the builder canvas preview (`WidgetItem.tsx`)
- the properties panel (`toolbar/property/WidgetPropertyContent.tsx`, driven
  by `toolbar/property/registry.ts` - see below)
- the submission fill-out page (`app/(main)/boards/[id]/submissions/[submissionId]/page.tsx`)
- the "add widget" handler (`template/TemplateBuilder.tsx`)

Setting-related components (the fields shown in the properties panel) are
**not** registered here - they live in a separate registry,
`toolbar/property/registry.ts` (`WIDGET_PROPERTY_REGISTRY`), keyed by the
same `WidgetType`. Each entry is a list of `WidgetPropertyDescriptor`s, one per
key of `WidgetProperties` the type exposes for editing (e.g. `label`,
`placeholder`, `options`) - see `toolbar/property/types.ts`.

## Folder layout

```
widget/
  types.ts             # WidgetDefinition, FieldComponentProps, FieldMode
  registry.ts           # WIDGET_REGISTRY: Record<WidgetType, WidgetDefinition>
  shared/                # small components reused by more than one widget
  <type>/
    Field.tsx             # required
    defaults.ts            # required: DEFAULT_SETTINGS, DEFAULT_LAYOUT
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

## Registering a new widget

1. Add the new id to the `WidgetType` union in `src/types/template.ts`.
2. Create `widget/<type>/Field.tsx` and `widget/<type>/defaults.ts`.
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

4. In `toolbar/property/registry.ts`, add an entry to
   `WIDGET_PROPERTY_REGISTRY` for the new type: a list of the
   `WidgetPropertyDescriptor`s to show, in display order (at minimum `[LABEL]`;
   add `PLACEHOLDER`/`REQUIRED`/`OPTIONS`/`CONTENT`/`LINK_URL` or a new
   bespoke field if the widget needs a property beyond the existing keys).

That's it - the picker, canvas preview, properties panel, fill page, and
"add widget" button all pick this up automatically. `WIDGET_REGISTRY` and
`WIDGET_PROPERTY_REGISTRY` are both typed as `Record<WidgetType, ...>`, so
forgetting a step is a TypeScript compile error, not a silent runtime gap.

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
