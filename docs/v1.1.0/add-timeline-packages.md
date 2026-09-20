# Add new packages for Timeline

## Currently

- The monorepo (`pnpm-workspace.yaml`) currently defines shared workspace packages under `packages/*`: `@tomato/grid` (`packages/grid`), `@tomato/icon` (`packages/icon`), and `@tomato/sync` (`packages/sync`), each consumed by `website`/`server` via the `@tomato/*` scope.
- There is no `Timeline`-related package under `packages/` yet.
- The only existing reference to "Timeline" in the repo is an acceptance-criteria mention in `docs/v1.0.0/add-board-view-feature.md` (`TimelineSettingPopup`) as an example of a future board view type — it was not implemented; `BoardViewType` currently only defines `"chart"` (implemented) and `"timeline"`/`"dashboard"` (enum placeholders, no settings UI).

## Acceptance Criteria

- [x] Add new Timeline library for system
- [x] With independence type, data, ...
- [x] Add new page `/demo` for display
- [x] Support drag and drop
- [x] Support creation when click

## Solutions

- [x] Add new package `@tomato/timeline`
- [x] Package with weekly mode
- [x] Accept list `Subject[]`
- [x] Accept list `Event[]`
- [x] Using Dnd for drag and drop
- [x] Using uuid for event
- [x] Header list filter by subjects (circle avatars)
- [x] Column header is days on week (from Monday to Sunday)
- [x] Without row header
- [x] Every row is bar with event name
- [x] Add component to demo
- [x] DemoPage include data (subjects + events + handlers)

## Design for interface

```ts
interface SubjectInterface {
  uuid: string;
  name: string;
  avatar: string;
}

interface EventInterface {
  uuid: string;
  start: number;
  end: number;
  subject: uuid;
  title: string;
  color: string;
}
```

## Design for UI

```markdown
- TimelineHeader - In top, flex flex-row
  - RangeControl
    - Button left icon
    - Current range text
    - Button right icon
    - Button reset
  - SubjectFilter - include multiple avatar icon, add ring when selected
- TimelineContent - flex-1
  - WeekHeader - list column
  - WeekContext - list row, scrollable
    - EventBar - flex flex-row
      - EventTitle - left
      - Subject - right
```

## Changelogs

**Scope**: new standalone `@tomato/timeline` package (independent from `website`, mirrors `packages/grid`'s isolation and `@dnd-kit/react` usage) plus a `/demo` page wiring it up with local mock data. No backend changes - this ticket is UI-library-only.

### Package `packages/timeline`

- `src/types.ts`: `SubjectInterface`/`EventInterface` exactly as specified in the ticket, plus a `UUID = string` alias (the ticket's `subject: uuid` field type) and a `TimelineDndType` const (mirrors `GridDndType` in `packages/grid/src/types.ts`).
- `src/utils.ts`: pure date/grid math - `getStartOfWeek` (Monday-start, local time), `getWeekDays`, `formatDayLabel`/`formatRangeLabel`, and `getEventGridPosition` (clamps an event's `[start, end)` to the visible week and returns a 0-based `{colStart, colSpan}` for CSS grid placement, or `null` if the event doesn't overlap that week). No date library added - native `Date`/`Intl` only, consistent with the rest of the monorepo (no `date-fns`/`dayjs` dependency anywhere else).
- `src/Timeline.tsx`: top-level component and the only one exported. Owns week-navigation state (`weekStart`, prev/next/reset via `RangeControl`) and subject-filter selection state (`Set<UUID>`, empty = show all). Generates the new event's `uuid` (via `uuid`'s `v4`) when a day cell is clicked, assigning it to the first subject in the list, then hands the fully-built `EventInterface` to the caller's `onEventCreate` - the package owns id generation (per the "Using uuid for event" solution item) so consumers don't have to. Accepts an optional `id` prop (else `useId()`) used as the drag-drop droppable id, so multiple `Timeline` instances can coexist on one page without colliding - same pattern `ContainerLayout` in `packages/grid` already requires via its own mandatory `id` prop.
- `src/TimelineHeader.tsx` / `RangeControl.tsx` / `SubjectFilter.tsx`: top bar per the ticket's UI design - prev/next/reset buttons + range label, and circle avatars (image or initials fallback) that get a `ring-primary` when selected as a filter.
- `src/TimelineContent.tsx` / `WeekHeader.tsx` / `WeekContent.tsx` / `EventBar.tsx`: `WeekHeader` renders the 7 Monday-Sunday day columns (current day highlighted). `WeekContent` renders one CSS-grid row per event (no row header, per the ticket), each `EventBar` (`useDraggable`) placed via `grid-column` from `getEventGridPosition`, plus a trailing row of 7 click targets (one per day) for creation. Drag-and-drop follows `packages/grid/src/ContainerLayout.tsx`'s existing technique exactly: a single `useDroppable` region + `useDragDropMonitor`'s `onDragEnd`, computing the dropped day column from the dragged element's rect relative to the container (`(sourceRect.left - containerRect.left) / dayWidth`), then shifting `start`/`end` by that day offset while preserving the event's original duration.
- Interpreted "WeekContext" in the ticket's UI design ASCII tree as a typo for "WeekContent" (matches the "TimelineContent" naming one level up).
- `package.json`/`tsconfig.json`: copied from `packages/grid`'s conventions (same `tsconfig` compiler options, same `main`/`types: ./src/index.ts` pattern, no build step). Dependencies: `@dnd-kit/react` (drag and drop, per solution item), `uuid`/`@types/uuid` (event id generation), `clsx`, `lucide-react` (icons for `RangeControl`, matching `packages/icon`'s version pin).

### Frontend (`website`)

- `website/package.json`: added `"@tomato/timeline": "workspace:*"` alongside the other `@tomato/*` workspace deps.
- Added `website/src/app/demo/page.tsx`: client component wrapping `<Timeline>` in `<DragDropProvider>` (same per-page pattern as `app/templates/[id]/page.tsx` and `app/submission/[uuid]/page.tsx` - the package itself stays provider-agnostic). Holds local `events` state seeded with 3 mock subjects/events; `onEventMove`/`onEventCreate` handlers just update that local state, satisfying "DemoPage include data (subjects + events + handlers)".

### Manual follow-ups (not run here, per project rules)

- Run `pnpm install` at the repo root to link the new `@tomato/timeline` workspace package (its `node_modules` don't exist yet, so the IDE currently reports unresolved `react`/`clsx`/`uuid` imports inside `packages/timeline` - expected until install runs) and update `pnpm-lock.yaml`.
- Smoke-test `/demo` in the browser: verify week navigation, subject-filter rings, dragging an event bar to another day, and clicking a day cell to create a new event.
