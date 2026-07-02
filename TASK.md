# Update `WIDGET_REGISTRY`

## Currently

- The `WIDGET_REGISTRY` load default setting and read default layout from subfolder
- But it's too messy and has too many problems.
- Solution is a file for all default setting, a file for all default layout, a folder include all Component

## Tasks

- [x] Create new files save all default setting is `Record<WidgetType, WidgetProperties>`
- [x] Create new files save all default layout is `Record<WidgetType, GridLayout>
- [x] File `registry` should load `setting` and `layout` from 2 files
- [x] Create `subfolder` is `items` include all components is `widget` component
- [x] Remove and cleanup
