import { GridLayout } from "@/types/template";
import { generateKeyBetween } from "fractional-indexing";
import { COLUMN_WIDTH, GRID_COLUMNS } from "./constants";
import { AbsoluteLayout } from "./types";

export function getColumnRange(layout: AbsoluteLayout): [number, number] {
  const col = Math.max(
    0,
    Math.min(Math.floor(layout.left / COLUMN_WIDTH), GRID_COLUMNS - 1),
  );
  const span = Math.max(
    1,
    Math.min(Math.round(layout.width / COLUMN_WIDTH), GRID_COLUMNS - col),
  );
  return [col, col + span - 1];
}

export function setMaxHeight(
  maxHeights: number[],
  layout: AbsoluteLayout,
): number[] {
  const [col, right] = getColumnRange(layout);
  for (let i = col; i <= right; i++) {
    maxHeights[i] = Math.max(maxHeights[i], layout.top + layout.height);
  }
  return maxHeights;
}

export function getMaxHeight(
  maxHeights: number[],
  layout: AbsoluteLayout,
): number {
  const [col, right] = getColumnRange(layout);
  return Math.max(...maxHeights.slice(col, right + 1));
}

export function collision(a: AbsoluteLayout, b: AbsoluteLayout): boolean {
  return (
    a.left < b.left + b.width &&
    a.left + a.width > b.left &&
    a.top < b.top + b.height &&
    a.top + a.height > b.top
  );
}

export function computeLayouts(
  items: Record<string, GridLayout>,
  heightMap: { get(id: string): number | undefined },
  moving: AbsoluteLayout | null,
  isOver = false,
): Record<string, AbsoluteLayout> {
  const sorted = Object.entries(items)
    .filter(([id]) => id !== moving?.id)
    .map(
      ([id, layout]): AbsoluteLayout => ({
        id,
        left: layout.isFullWidth ? 0 : layout.column * COLUMN_WIDTH,
        top: 0,
        width: layout.isFullWidth
          ? GRID_COLUMNS * COLUMN_WIDTH
          : layout.span * COLUMN_WIDTH,
        height: heightMap.get(id) ?? 0,
        idx: layout.idx,
        isStatic: layout.isStatic,
        isFullWidth: layout.isFullWidth,
      }),
    )
    .sort((a, b) => (a.idx > b.idx ? 1 : -1));

  console.log(isOver);

  if (moving && isOver) {
    const insertAt = sorted.findIndex((layout) => collision(layout, moving));
    if (insertAt === -1) {
      sorted.push({
        ...moving,
        idx: generateKeyBetween(sorted.at(-1)?.idx ?? null, null),
      });
    } else {
      sorted.splice(insertAt, 0, {
        ...moving,
        idx: generateKeyBetween(
          sorted[insertAt - 1]?.idx ?? null,
          sorted[insertAt]?.idx,
        ),
      });
    }
  }

  let maxHeights = new Array<number>(GRID_COLUMNS).fill(0);
  for (const item of sorted) {
    item.top = getMaxHeight(maxHeights, item);
    maxHeights = setMaxHeight(maxHeights, item);
  }

  const results: Record<string, AbsoluteLayout> = Object.fromEntries(
    sorted.map((item) => [item.id, item]),
  );

  if (moving) {
    results[moving.id] = {
      ...results[moving.id],
      left: moving.left,
      top: moving.top,
    };
  }

  return results;
}
