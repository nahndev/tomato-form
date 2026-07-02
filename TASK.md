# Update properties base on key of `WidgetProperties`

## Currently

- Property in `./website/src/features/template/components/toolbar/property` using group `properties` by `tabs`
- It don't better for expand.
- We want update base on `key` of `WidgetProperties`

## Tasks

- [x] Restructure of `WidgetPropertyBox` become list instead of tabs
- [x] Registry should is `key - WidgetType` include many `key - WidgetProperties`
- [x] Every `key` will has a `Component`
- [x] Add new action of `useWidgetActions` set property base on `key` of `WidgetProperties`
