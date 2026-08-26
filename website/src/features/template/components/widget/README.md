# Widgets

This folder contains every form-field "widget" type as a self-contained
plugin, split across two halves:

- **Data** - `constants/widget/widgetItems.ts` (`WidgetItems`): label, icon,
  description, grouping, and defaults. No React involved.
- **Rendering** - `components/widget/registry.ts` (`WidgetComponents`): the
  React component for each type.

Both are `Record<WidgetType, ...>`, keyed the same way, and together are the
single source of truth consumed by:

- the widget picker sidebar (`WidgetPicker.tsx`)
- the builder canvas preview (`WidgetItem.tsx`)
- the properties panel (`toolbar/property/WidgetPropertyContent.tsx`, driven
  by `toolbar/property/registry.ts` - see below)
- the submission fill-out page (`app/submission/[uuid]/page.tsx`)
- the "add widget" handler (`template/TemplateBuilder.tsx`)

Setting-related components (the fields shown in the properties panel) are
**not** registered here - they live in a separate registry,
`toolbar/property/registry.ts` (`WIDGET_PROPERTY_REGISTRY`), keyed by the
same `WidgetType`. Each entry is a list of `WidgetPropertyDescriptor`s, one per
key of `WidgetProperties` the type exposes for editing (e.g. `label`,
`placeholder`, `options`) - see `toolbar/property/types.ts`. `WidgetProperties`
fields live directly on the `Widget` entity itself (`Widget extends
WidgetProperties`) - there's no separate properties record to keep in sync.

## Folder layout

```text
constants/widget/
  widgetItems.ts         # WidgetItems: Record<WidgetType, WidgetItemDefinition>
  settings.ts             # DEFAULT_SETTINGS: Record<WidgetType, WidgetProperties>
  layouts.ts               # DEFAULT_LAYOUTS: Record<WidgetType, Omit<GridLayout, "idx">>

components/widget/
  registry.ts             # WidgetComponents: Record<WidgetType, WidgetComponent>
  items/
    <Type>WidgetItem.tsx    # Field component for one widget type, e.g. TextWidgetItem.tsx
```

`WidgetItemDefinition`, `WidgetComponent`, and `FieldComponentProps` all live
in `@/types/widget.ts`.

## Required exports

### `components/widget/items/<Type>WidgetItem.tsx`

A single named-export component implementing:

```ts
interface FieldComponentProps<TValue = unknown> {
  widget: Widget; // merged entity - id, type, and all WidgetProperties fields
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

### `constants/widget/settings.ts` / `constants/widget/layouts.ts`

All widgets' defaults live in these two files, keyed by `WidgetType`:

```ts
// constants/widget/settings.ts
export const DEFAULT_SETTINGS: Record<WidgetType, WidgetProperties> = {
  ...
  [WidgetType.RATING]: { label: "Rating" },
};

// constants/widget/layouts.ts
export const DEFAULT_LAYOUTS: Record<WidgetType, Omit<GridLayout, "idx">> = {
  ...
  [WidgetType.RATING]: { column: 0, span: 2 },
};
```

`idx` is intentionally omitted from layouts - it is always computed at
insertion time from sibling widgets via `generateKeyBetween` (see
`TemplateBuilder.handleAddWidget`).

## Widget groups

Each `WidgetItemDefinition` carries a `group: WidgetGroup` (`common`,
`media`, `advance`, or `system`), which the widget picker sidebar
(`WidgetPicker.tsx`) uses to render widgets under a section heading instead
of one flat list. `system` is reserved for widgets backed by platform data
rather than author-entered content (e.g. `users`).

## Registering a new widget

1. Add the new member to the `WidgetType` enum in `src/types/widget.ts`.
2. Create `components/widget/items/<Type>WidgetItem.tsx`, exporting a
   component named `<Type>WidgetItem` (e.g. `RatingWidgetItem`).
3. Add the new type's entries to `constants/widget/settings.ts` and
   `constants/widget/layouts.ts`.
4. In `constants/widget/widgetItems.ts`, add one entry to `WidgetItems`,
   including a `group`:

```ts
[WidgetType.RATING]: {
  type: WidgetType.RATING,
  label: "Rating",
  icon: TomatoIconKey.Star,
  description: "1-5 star rating",
  isDataField: true,
  group: WidgetGroup.COMMON,
  defaultSettings: DEFAULT_SETTINGS[WidgetType.RATING],
  defaultLayout: DEFAULT_LAYOUTS[WidgetType.RATING],
},
```

5. In `components/widget/registry.ts`, import the component and add one
   entry to `WidgetComponents`:

```ts
import { RatingWidgetItem } from "./items/RatingWidgetItem";

// inside WidgetComponents = { ... }
[WidgetType.RATING]: RatingWidgetItem as WidgetComponent,
```

6. In `toolbar/property/registry.ts`, add an entry to
   `WIDGET_PROPERTY_REGISTRY` for the new type: a list of the
   `WidgetPropertyDescriptor`s to show, in display order (at minimum `[LABEL]`;
   add `PLACEHOLDER`/`REQUIRED`/`OPTIONS`/`CONTENT`/`LINK_URL` or a new
   bespoke field if the widget needs a property beyond the existing keys).

That's it - the picker, canvas preview, properties panel, fill page, and
"add widget" button all pick this up automatically. `WidgetItems`,
`WidgetComponents`, and `WIDGET_PROPERTY_REGISTRY` are all typed as
`Record<WidgetType, ...>`, so forgetting a step is a TypeScript compile
error, not a silent runtime gap.

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
