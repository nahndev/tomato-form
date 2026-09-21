# Changelog

All notable changes to this project are documented in this file, grouped by release version.
Each entry links to its full ticket doc under `docs/<version>/`.

## v1.1.0

### Timeline

- **Preserve time on move/resize** ([timeline-preserve-time-on-move](docs/v1.1.0/timeline-preserve-time-on-move.md)): dragging or resizing an event in `@tomato/timeline` no longer snaps to whole-day increments — both gestures now compute a continuous pixel→time offset snapped to a 30-minute step (`STEP_MS`), so an event's time-of-day is preserved (or intentionally changed) across a move, and resize handles can shift a boundary by sub-day amounts too. Adds a dependency-free `onResizeEnd` handle pair to `EventBar` and threads a new `onEventResize` prop through `Timeline` → `TimelineContent` → `WeekContent`. Also reworked `getEventGridPosition` to return a continuous `{ leftPercent, widthPercent }` instead of a day-column `{ colStart, colSpan }`, and switched `WeekContent`'s event row from a `grid-cols-7` layout to absolute positioning, so events visually render at their exact time instead of snapping to whole day-cells.
