# Widgets

## Files

```text
website/src/types/widget.ts
  WidgetType                    enum ("text", "select", ...)
  FieldComponentProps<TValue>   { widget, value?, onChange? }
  WidgetComponent<TValue>       ComponentType<FieldComponentProps<TValue>>
  WidgetItemRegistry / WidgetComponentRegistry  Record<WidgetType, ...>

website/src/types/template.ts
  Widget                        WidgetProperties + { id, type }
  WidgetProperties              label, placeholder, required, options, content,
                                 url, actions, compact, textStyle, containerStyle
  GridLayout                    { column, span, idx, isStatic?, isFullWidth? }
  WidgetGroup                   common | media | advance | system | DEFAULT

website/src/features/template/constants/widget/
  widgetItems.ts       WidgetItems: Record<WidgetType, WidgetItemDefinition>
  settings.ts          DEFAULT_SETTINGS: Record<WidgetType, WidgetProperties>
  layouts.ts           DEFAULT_LAYOUTS: Record<WidgetType, Omit<GridLayout, "idx">>
  displayTypes.ts      DISPLAY_TYPE_REGISTRY: Record<DisplayType, DisplayTypeDefinition> (icon/label/color per DisplayType, for board columns)
  valueProperties.ts   WIDGET_VALUE_PROPERTY_REGISTRY: Record<WidgetType, Partial<Record<ValueProperty, DisplayType[]>>>
                       - which value-properties a widget's value exposes (e.g. datetime's default/date/time), and which
                       DisplayType(s) each one may render as on a board column - see docs/v1.0.0/add-column-cell-property.md

website/src/features/template/components/widget/
  registry.ts                 WidgetComponents: Record<WidgetType, WidgetComponent>
  WidgetItem.tsx               builder canvas: wraps WidgetComponents[type] in <div inert>
  items/<Type>WidgetItem.tsx   field component per type

website/src/features/template/components/property/
  registry.ts                       WIDGET_PROPERTY_REGISTRY: Record<WidgetType, WidgetPropertyKey[]>
  descriptors/registry.ts           PROPERTY_DESCRIPTOR_REGISTRY: Partial<Record<WidgetPropertyKey, WidgetPropertyDescriptor>>
  types.ts                          WidgetPropertyDescriptor { label, Component }, keyed by WidgetPropertyKey
  descriptors/<Key>Descriptor.tsx   one per WidgetProperties key

website/src/features/template/components/toolbar/
  creation/WidgetPicker.tsx           reads WidgetItemList, calls addWidget
  property/WidgetPropertyPanel.tsx    standalone left-hand panel (mirrors ToolbarPanel),
                                       auto-opens via useWidgetSelection
  property/WidgetPropertyBox.tsx      shows WidgetPropertyContent for selected widget
  property/WidgetPropertyContent.tsx  reads WIDGET_PROPERTY_REGISTRY, calls setProperty

website/src/features/template/sync/
  handlers/WidgetHandler.ts   yjs `widgets` map: addWidget/removeWidget/setProperty
  handlers/LayoutHandler.ts   places/removes GridLayout on widget add/remove events
  hooks/useWidgetActions.ts   addWidget(id, type, before) / removeWidget(id) / setProperty(id, key, value)

website/src/features/submission/components/widget/SubmissionWidgetItem.tsx
  fill page: renders WidgetComponents[type] with real value/onChange (no inert)

website/src/app/submission/[uuid]/page.tsx   renders SubmissionWidgetItem per widget
```

Same field component renders in both places; no `mode` prop exists. Builder
canvas = wrapped in `<div inert>` (no value/onChange). Fill page = unwrapped,
wired to real value/onChange.

## Steps to add a widget (example: `RATING`)

1. `types/widget.ts` — add `RATING: "rating"` to `WidgetType`.
2. `constants/widget/settings.ts` — `DEFAULT_SETTINGS[WidgetType.RATING]`.
3. `constants/widget/layouts.ts` — `DEFAULT_LAYOUTS[WidgetType.RATING]` (no `idx`).
4. `constants/widget/widgetItems.ts` — `WidgetItems[WidgetType.RATING]` entry
   (type, label, icon, description, isDataField, group, defaultSettings, defaultLayout).
5. `components/widget/items/RatingWidgetItem.tsx` — implements
   `FieldComponentProps<TValue>`. Call `onChange` on edits; skip if the
   widget has no value (`break`/`label`/`button`-style).
6. `components/widget/registry.ts` — add to `WidgetComponents`.
7. `components/property/registry.ts` — add `WIDGET_PROPERTY_REGISTRY[WidgetType.RATING]`,
   a list of `WidgetPropertyKey`s to show (existing keys `"label"`/`"placeholder"`/
   `"required"`/`"options"`/`"content"`/`"actions"`/`"textStyle"`/`"containerStyle"`,
   or add a new `WidgetProperties` key + an entry in
   `components/property/descriptors/registry.ts`'s `PROPERTY_DESCRIPTOR_REGISTRY`).

No other file needs changes; all consumers key off these `Record<WidgetType, ...>` registries.

## Known gaps

- `datetime` value = epoch **ms**, local timezone implicit.
- `image-uploader`/`file-uploader`/`signature`/`board`: no backend upload
  endpoint — values are client-side data URLs / bare file metadata only.
- Don't add a `mode` prop — preview vs. fill is the `inert`-wrapper, not a flag.
