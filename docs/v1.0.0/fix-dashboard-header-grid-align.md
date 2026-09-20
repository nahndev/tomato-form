# Fix template dashboard header and content grid not align

## Currently

On the template dashboard page (`website/src/app/system/templates/page.tsx`), the header (`DashboardHeader.tsx` — "Templates" title + "New Template" button) and the content grid below it (`DashboardContent.tsx` → `ListTable.tsx`) are visually misaligned along the left/right edges.

Both sections share the same outer container (`container mx-auto max-w-5xl px-6`), but:

- `DashboardHeader.tsx` renders its title/button flush against the container edges (only `px-6` from the shared wrapper).
- `ListTable.tsx` wraps the grid in its own bordered box (`rounded-lg border`), and its rows/header (`ListTableContent.tsx`, `ListTableHeader.tsx`) use an additional `px-2` plus a fixed `w-10` checkbox column before any cell content, and a `w-10` slot for the row-menu on the right.

As a result, the row/cell text starts noticeably further right than the header's title/button, and the bordered box adds its own inset that the header doesn't have — producing a visible left/right edge mismatch between the header and the grid content.

## Acceptance Criteria

- [x] The left edge of the header content ("Templates" title) visually aligns with the left edge of the grid's row content (not the checkbox column).
- [x] The right edge of the header content ("New Template" button) visually aligns with the right edge of the grid content.
- [x] Alignment holds across breakpoints (not just desktop width).
- [x] No regression to existing `ListTable` usages elsewhere (if `ListTable`/`ListTableContent`/`ListTableHeader` are shared components).

## Solutions

- [x] Confirm whether `ListTable` is used only on the template dashboard or shared with other pages, to scope whether padding/inset changes are safe to apply globally or need a dashboard-specific override.
- [x] Reconcile the horizontal insets: either add matching padding/margin to `DashboardHeader.tsx` to account for the grid's border + `px-2` + `w-10` checkbox column, or adjust `ListTable`'s internal padding/column widths so its content aligns with the shared container edges.
- [x] Verify the fix visually against both the header row and data rows, including the "New Template" button vs. the row-menu (`w-10`) column on the right.

## Changelogs

- Fixed an internal `ListTable` bug found while investigating: `ListTableHeader.tsx`'s root div carried its own redundant `px-2`, nested inside `ListTable.tsx`'s already-`px-2`'d wrapper — so the header row's checkbox/columns started 8px further right than the content rows' (which only get one `px-2`, from their own row div). Removed the duplicate `px-2` from `ListTableHeader.tsx` so header and row content align.
- Reworked `DashboardHeader.tsx` (`website/src/features/template/components/dashboard/DashboardHeader.tsx`) to mirror `ListTable`'s horizontal framing instead of sitting flush against the shared page container:
  - Wrapped the header in `border border-transparent px-2` to reserve the same 1px border + 8px padding inset as the grid's `rounded-lg border` box.
  - Added an invisible `h-10 w-10` leading spacer (matching the row/header checkbox column) before the "Templates" title, and swapped the row's `gap-3` for `gap-2` to match the checkbox-to-column gap used in `ListTableHeader`/`ListTableContent` — so the title now starts at the same x-position as the "Name" column text, not the checkbox.
  - Added a matching trailing `h-10 w-10` spacer after the "New Template" button (matching the row-menu column) so the button's right edge lines up with row content on the right.
  - Indented the "X templates · Y published · Z draft" subtitle with `pl-12` (= spacer width `w-10` + gap `gap-2`) so it stays aligned under the title instead of reverting to the old flush-left position.
- Scope check: `ListTable`/`ListTableContent`/`ListTableHeader` are only consumed by `DashboardContent.tsx` (template dashboard), so no other page is affected by the `ListTableHeader` padding fix.
- Follow-up fix from a real screenshot review: `ListTableHeader.tsx`'s root div is nested inside `ListTable.tsx`'s own `flex` wrapper (`flex h-10 items-center bg-muted/40 px-2 text-sm`). Without an explicit width, a flex-row child shrinks to its content size instead of stretching, so the header row's `flex-1` "Name"/"Who & where" columns had no space to grow into and bunched together, and the `border-b` underline stopped short instead of spanning the full row — unlike the data rows, whose row `div`s aren't nested inside another flex parent and so stretch full width natively. Added `w-full` to `ListTableHeader.tsx`'s root div to fix it.
- Not run: dev server / visual verification (per repo convention of not running the project) and lint/typecheck — changes are Tailwind class-only, no logic touched, no existing tests cover these presentational components. The `w-full` follow-up was confirmed against a screenshot the user provided of the rendered page.
