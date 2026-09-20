# Changelog

All notable changes to this project are documented in this file, grouped by release version.
Each entry links to its full ticket doc under `docs/<version>/`.

## v1.0.0

### Board

- **Board views** ([add-board-view-feature](docs/v1.0.0/add-board-view-feature.md)): added a `View` framework for boards — a Views tab, sidebar/list UI, a view-type picker, and a display-mode switcher — plus one fully-built view type, Chart. Calendar/Dashboard view types are enum placeholders shown as "Coming soon" for now.
- **Per-column value properties** ([add-column-cell-property](docs/v1.0.0/add-column-cell-property.md)): board columns can now target a specific value-property of a widget (e.g. a `datetime` widget's `date` vs. `time` vs. `default`), not just the widget as a whole. Adds `WIDGET_VALUE_PROPERTY_REGISTRY`, reshapes `BoardColumn.items` to `{ widgetId, property }`, and adds `TIME`/`DATETIME` display types end-to-end (frontend + backend mappers). **Requires a one-time destructive DB wipe of `submissions`/`boards`** — old-shape data has no migration path (see ticket for the `psql TRUNCATE` command).

### Template builder

- **Widget property panel moved to the left** ([move-widget-property-menu-to-left](docs/v1.0.0/move-widget-property-menu-to-left.md)): the widget property editor is now its own standalone panel on the left of the canvas (auto-opens on widget selection), instead of sharing the right-hand toolbar with Widget/Structure/Version tabs.
- **Property registry refactor** ([refactor-property-registry-constant](docs/v1.0.0/refactor-property-registry-constant.md)): `WIDGET_PROPERTY_REGISTRY` now maps each widget type to a plain list of property keys; the actual `{ label, Component }` info moved to a separate `PROPERTY_DESCRIPTOR_REGISTRY`, decoupling property data from the widgets that use it.
- **Session removal** ([remove-session](docs/v1.0.0/remove-session.md)): sessions can now be deleted from their settings popup (with confirmation), cascading to remove their widgets; the last remaining session can't be removed, and deleting the active session falls back to another one.
- **Choice widget settings UI** ([improve-choice-settings-ui](docs/v1.0.0/improve-choice-settings-ui.md)): select/radio/checkbox options are now edited as a drag-and-drop list (stable `key` + editable `value`, ordered via `fractional-indexing`) instead of a raw textarea, so retyping an option's label no longer orphans existing submission answers.
- **Button widget actions restructured** ([adjust-action-button-widget](docs/v1.0.0/adjust-action-button-widget.md)): button actions (open link, send mail) moved into a new shared `features/actions/` module with an `ACTION_REGISTRY`, making it a one-entry change to add a new action type in the future.

### Backend

- **Widget value handling refactor** ([refactor-widget-value-backend](docs/v1.0.0/refactor-widget-value-backend.md)): introduced a new `server/src/widget-value/` module — a typed, per-widget-type value contract (`WidgetValueInterface`/`ValueInterface` + a factory) shared by the display-doc pipeline, replacing the old ad-hoc `display/mappers/*`. Frontend-side follow-up (`ValueType` registry) is tracked as future work.

### Fixes

- **Dashboard header/grid alignment** ([fix-dashboard-header-grid-align](docs/v1.0.0/fix-dashboard-header-grid-align.md)): fixed the template dashboard header and list-table grid being visually misaligned on both edges, including a duplicate-padding bug in `ListTableHeader` and a missing `w-full` causing the header row to not stretch full width.
- **Floating toolbar visibility** ([floating-toolbar-visibility](docs/v1.0.0/floating-toolbar-visibility.md)): the Lexical floating formatting toolbar now only shows while the editor is focused, and hides on blur, via a new reusable `useEditorFocus` hook.
