# Add feature `view` for `board`

## Currently

- Board hiện chỉ hỗ trợ 1 kiểu hiển thị dữ liệu submission: dạng list/table
  (xem `server/src/board/`, `website/src/features/board/components/submission/display/`),
  chưa có cơ chế để thêm các kiểu hiển thị khác (biểu đồ, lịch, dashboard thống kê, ...).
- Người dùng cần khả năng tạo và cấu hình nhiều "View" khác nhau trên cùng một board,
  ví dụ: Table View (đã có), Chart View (đếm/tổng hợp theo giá trị, theo thời gian...),
  Calendar View, Dashboard/Stats View.
- Mục tiêu: xây dựng cơ chế `View` cho `board`.

## Acceptance Criteria

- [x] Định nghĩa nhiều loại view (bắt đầu với Chart View, mở rộng sau cho Calendar, Dashboard...).
- [x] Người dùng cấu hình view (chọn trường dữ liệu, kiểu tổng hợp, kiểu biểu diễn...).

## Solutions

- [x] Add new tab for board setting `Views`
- [x] BoardViewSetting page include sidebar is list all views, create button for creation
- [x] When click on skeleton, should UI choice type (default is Chart)
- [x] After choice type, should setting window. ex: ChartSettingPopup, AppointmentSettingPopup, ...
- [x] `website/src/features/board/components/submission/display/` add button group include all views + default (list-table).
- [x] When click button, change display mode

## Changelogs

**Scope**: full View framework (types, tab, sidebar/list UI, type picker, switcher) plus one fully-built view type, Chart. Calendar/Dashboard get enum placeholders and show as "Coming soon" in the type picker but have no settings UI yet - extend later, per the acceptance criteria above.

### Backend

- `server/src/database/schema.prisma`: added `views Json @default("[]")` to `Board`, plus migration `20260920120000_add_board_views`. Not applied here (per project rule to avoid running the project) - run `prisma migrate deploy`/`migrate dev` to apply it.
- Added `server/src/board/board-view.types.ts`: `BoardViewType` ("chart"/"calendar"/"dashboard"), `ChartAggregation` ("count"/"sum"/"avg"), `ChartKind` ("bar"/"line"/"pie"), `BoardChartViewConfig`, `BoardView`.
- Added `server/src/board/dto/board-view.dto.ts`: `BoardViewDto` with a custom `IsBoardViewConfigConstraint` that validates the chart config shape (group-by required, value field required unless aggregation is "count") and accepts an empty placeholder config for calendar/dashboard. Reuses `IsBoardColumnItemsConstraint` (now exported from `board-column.dto.ts`) for `groupBy`/`valueField`.
- `create-board.dto.ts`/`update-board.dto.ts`: added optional `views: BoardViewDto[]`.
- `board.service.ts`: `create`/`update` pass `views` through to Prisma, mirroring the existing `columns` handling.
- Tests: `board-view.dto.spec.ts` (12 cases) and extended `board.service.spec.ts` for `views` create/update pass-through. Added `getMockBoardView`/`getMockBoardChartViewConfig` to the server-side `board.factory.ts`.
- Note: mid-implementation, `BoardColumn.items` was refactored elsewhere in the repo from `Record<templateId, {widgetId, property}>` to `Record<templateId, "widgetId:property">` compound-key strings; `groupBy`/`valueField` were built against the new (compound-key) convention throughout.

### Frontend

- Added `website/src/types/board-view.ts` (mirrors the backend types) and extended `website/src/types/board.ts`: `Board.views`, `CreateBoardInput.views`, `BoardTabValue.VIEWS`.
- Added `website/src/features/board/constants/view/boardViewTypes.ts`: `BOARD_VIEW_TYPE_REGISTRY`/`BOARD_VIEW_TYPE_LIST`, one flat registry (a two-registry split like the widget-property panel's wasn't warranted - only one view type has a config UI so far).
- Views settings tab: `BoardTab.tsx` gained a "Views" tab rendering the new `BoardViewSetting.tsx` (sidebar list + "Add view" button) → `BoardViewTypePickerDialog.tsx` (default/highlighted choice: Chart; Calendar/Dashboard shown disabled) → `ChartSettingPopup.tsx` (Formik + Yup: name, per-template group-by field via the existing `TemplateWidgetSelect`, aggregation, value field - shown only when aggregation isn't "count", chart kind). `BoardViewListItem.tsx` handles per-view edit/delete (delete via the same `AlertDialog` danger-zone pattern as `SessionSettingPopup.tsx`).
- Save UX: each create/edit/delete persists immediately via its own `useUpdateBoard` call (not batched with a Save button, unlike the Columns tab).
- View switcher + rendering: `BoardViewSwitcher.tsx` (shadcn `toggle-group`) added to `WorkspaceBoardContent.tsx` above the submission list; switching to a view renders the new `ChartDisplay.tsx` instead of the table. Active view is local component state only (not persisted - always resets to Table on reload).
- Added `website/src/features/board/utils/chartAggregation.ts` (`aggregateSubmissionsForChart`, pure/TDD'd): groups submissions by the resolved group-by label (via a new `JsonSubmission.getDisplayValueForItemKey`), reduces by count/sum/avg. Submissions missing the group-by value are bucketed under `"(empty)"`; submissions missing the value field are excluded from sum/avg rather than treated as zero.
- Extracted `parseNumberDisplayValue`/`parseLabelDisplayValue` (`website/src/features/board/utils/submissionDisplayValue.ts`) out of `NumberValue.tsx`/`TextValue.tsx` so chart aggregation reuses the same value-parsing logic as table rendering instead of reimplementing it.
- `ChartDisplay.tsx` renders bar/line/pie via recharts (already a dependency) and the shadcn `chart.tsx` wrapper (hand-written - see below). Colors: bar/line use the existing `--chart-1` token (single series, x-axis carries identity); pie uses a new small validated categorical palette (`--chart-cat-1..5` in `globals.css`) because the existing `--chart-1..5` tokens are shades of one hue and fail a colorblind-safety check (see `dataviz` skill) - not safe for a pie chart, where color is the primary identity encoding. Pie caps at 5 slices, folding overflow into "Other".
- shadcn additions: `pnpm dlx shadcn@latest add chart toggle-group` failed against this repo's registry config (same failure mode noted in `remove-session.md` for `alert-dialog`) - `components/ui/chart.tsx` and `components/ui/toggle-group.tsx` were hand-written instead, matching existing component conventions (`radix-ui` package, `cn` utility, `class-variance-authority`). No new dependencies were needed (`recharts` and `radix-ui`'s `ToggleGroup` were already present).
- Added a `BarChart` icon to `packages/icon/src/icons.ts` (lucide's `BarChart3`) for the Chart view type.
- Tests: `boardViewTypes.test.ts`, `chartAggregation.test.ts` (7 cases), `ChartSettingPopup.test.tsx`, `BoardViewSwitcher.test.tsx`, `ChartDisplay.test.tsx`. Added `getMockBoardView`/`getMockBoardChartViewConfig` to the frontend `board.factory.ts`.

### Manual follow-ups (not run here, per project rules)

- Apply the Prisma migration and regenerate the client if not already done (`prisma generate` was run during implementation so the code compiles/tests against the new `views` column; `prisma migrate dev`/`deploy` still needs to run against a real database).
- Smoke-test in the browser: create a Chart view, switch to it, confirm the aggregation renders correctly for a real board's submissions.
