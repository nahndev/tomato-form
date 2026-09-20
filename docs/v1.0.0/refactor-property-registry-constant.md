# Refactor property registry to use constant instead of object

## Currently

- The `WIDGET_PROPERTY_REGISTRY` base on `object` include full information for properties
- But, it coupling data with framework
- We need split it

## Acceptance Criteria

- [x] WIDGET_PROPERTY_REGISTRY must only include `key` for all properties
- [x] Base on `key` -> Load all information

## Solutions

- [x] WIDGET_PROPERTY_REGISTRY -> Update using `key`
- [x] List all dependencies -> List all changes
- [x] Update all UI
- [x] Split information of properties and link between properties and widget into 2 files (move to correct folder)

## Changelogs

- `website/src/features/template/components/property/types.ts`: `WidgetPropertyDescriptor` no
  longer carries `key`; added `WidgetPropertyDescriptorRegistry` (`Partial<Record<WidgetPropertyKey, WidgetPropertyDescriptor>>`)
  and changed `WidgetPropertyRegistry` to `Record<WidgetType, WidgetPropertyKey[]>`.
- `website/src/features/template/components/property/registry.ts`: `WIDGET_PROPERTY_REGISTRY`
  now maps each `WidgetType` to a plain array of `WidgetPropertyKey` strings (no more
  `LABEL`/`PLACEHOLDER`/... descriptor objects).
- `website/src/features/template/components/property/descriptors/registry.ts` (new): holds the
  actual property information — `PROPERTY_DESCRIPTOR_REGISTRY`, keyed by `WidgetPropertyKey`,
  each entry `{ label, Component }`. This is the "link between properties and widget" (registry.ts)
  vs. "information of properties" (descriptors/registry.ts) split.
- `website/src/features/template/components/toolbar/property/WidgetPropertyContent.tsx`: now
  reads the key list from `WIDGET_PROPERTY_REGISTRY`, resolves each key's `{ label, Component }`
  from `PROPERTY_DESCRIPTOR_REGISTRY`, and skips rendering if a key has no descriptor.
- `docs/WIDGET.md`: updated file map and "add a widget" step 7 to reflect the two-file split.
