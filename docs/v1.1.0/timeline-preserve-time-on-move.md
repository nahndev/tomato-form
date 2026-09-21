# Improve `@tomato/timeline` to support dragdrop and resize to any time in any date

## Rules

- MUST using with scope `/packages/timeline`

## Currently

- `packages/timeline/src/WeekContent.tsx`'s `useDragDropMonitor({ onDragEnd })` computes the dropped day as `newStart = weekStart + dayIndex * DAY_MS` (always local midnight of the target day), then applies `onEventMove(event.uuid, newStart, newStart + duration)`. Dragging an event to another day always resets its `start` (and, by extension, `end`) to `00:00` of that day — any original time-of-day is lost.
- `handleEventResize` (same file) converts `deltaWidth` into whole `DAY_MS` units (`dayDelta = Math.round(deltaWidth / dayWidth)`) and shifts `event.start`/`event.end` by that many full days — resizing only ever moves a boundary by whole days, never by a sub-day time.
- `EventInterface` (`src/types.ts`) stores `start`/`end` as raw epoch `number` timestamps with no separate date/time concept, and `getEventGridPosition` (`src/utils.ts`) positions/spans events purely by day columns (`Math.floor`/`Math.ceil` against `DAY_MS`) — the grid itself has no sub-day (hour/minute) resolution.
- `website/src/app/demo/page.tsx` is the only current consumer wiring `onEventMove`/`onEventResize`/`onEventCreate` through to `<Timeline>`.

## Acceptance Criteria

- [x] Dragging an event can change its start/end time without being forced to whole-day increments
- [x] Resizing an event (left/right handle) can change its start/end time without being forced to whole-day increments.
- [x] Can drag from 8:20 11/2/2020 to 9:10 12/02/2020 (snapped to the nearest 30-min mark)
- [x] Can resize from 8:20 12/02/2020 to 6:30 11/02/2020 (snapped to the nearest 30-min mark)
- [x] Step is 30 min

## Solutions

- [x] `constants.ts`: add `STEP_MS` (30 min) as the shared drag/resize snap increment.
- [x] `utils.ts`: add `snapToStep(value, step)` helper, rounding a ms value to the nearest step multiple.
- [x] `WeekContent.tsx`'s `onDragEnd`: replace the whole-day `dayIndex` calculation with a continuous pixel→ms offset across the full week width, clamped to `[0, WEEK_MS - STEP_MS]` and snapped via `snapToStep`, so drop position now encodes both day and time-of-day.
- [x] `WeekContent.tsx`: add `handleEventResize`, converting a resize handle's pixel `deltaX` into `deltaMs` (via the same day-width ratio), applying it to `event.start` (left handle) or `event.end` (right handle), snapping the result, and clamping to a minimum `STEP_MS` duration.
- [x] `EventBar.tsx`: add left/right resize handles (plain absolutely-positioned divs + pointer events, no new dependency) that report the total pointer `deltaX` on pointerup via a new `onResizeEnd` prop. No live resize preview (same as drag, which relies on dnd-kit's own overlay) — kept out of scope to avoid fighting the CSS-grid-based day-column layout.
- [x] Thread a new `onEventResize?: (uuid, start, end) => void` prop through `Timeline` → `TimelineContent` → `WeekContent` → `EventBar`, mirroring the existing `onEventMove` plumbing.
- [x] `website/src/app/demo/page.tsx`: wire `onEventResize` the same way as `onEventMove`.
- [x] `utils.ts`'s `getEventGridPosition` reworked: it used to return a day-column `{ colStart, colSpan }` (via `Math.floor`/`Math.ceil` against `DAY_MS`), which visually snapped every event to whole day-cells in `WeekContent`'s `grid-cols-7` layout — masking the sub-day precision now carried by `start`/`end`. It now returns a continuous `{ leftPercent, widthPercent }` (event span as a % of the full week), and `WeekContent` positions each event with `absolute`/`left`/`width` instead of a CSS grid column, so the event visually starts/ends at its exact time, not just its day.
- [x] Left the header (`WeekHeader.tsx`) and the "create event" button row's `grid-cols-7` layouts as-is — both are just 7 evenly-spaced day labels/buttons, unrelated to event time precision.

Note: a stashed WIP attempt at this ticket (using the `re-resizable` library, with unsnapped continuous positioning) existed before this work and was discarded per user direction in favor of a dependency-free implementation with proper 30-min snapping.
