import { GridLayout } from "@/types/template";
import { generateKeyBetween } from "fractional-indexing";
import { COLUMN_WIDTH, GRID_COLUMNS } from "./constants";
import { AbsoluteLayout } from "./types";

export interface LayoutRect {
  left: number;
  top: number;
  width: number;
  height: number;
}
export class WidgetUtils {
  static getAbsoluteWidth(layout: GridLayout): number {
    return layout.isFullWidth
      ? GRID_COLUMNS * COLUMN_WIDTH
      : layout.span * COLUMN_WIDTH;
  }

  static getAbsoluteLeft(layout: GridLayout): number {
    return layout.isFullWidth ? 0 : layout.column * COLUMN_WIDTH;
  }
}
export class AbsoluteLayoutUtils {
  static fromGridLayout(
    id: string,
    layout: GridLayout,
    height: number,
  ): AbsoluteLayout {
    return {
      id,
      left: WidgetUtils.getAbsoluteLeft(layout),
      top: 0,
      width: WidgetUtils.getAbsoluteWidth(layout),
      height,
      idx: layout.idx,
      isStatic: layout.isStatic,
      isFullWidth: layout.isFullWidth,
    };
  }

  static collision(a: LayoutRect, b: LayoutRect): boolean {
    return (
      a.left < b.left + b.width &&
      a.left + a.width > b.left &&
      a.top < b.top + b.height &&
      a.top + a.height > b.top
    );
  }
}

export function getColumnRange(layout: LayoutRect): [number, number] {
  const col = getColumn(layout);
  const span = getSpan(layout);
  return [col, col + span - 1];
}

export function getColumn(layout: LayoutRect): number {
  return Math.max(
    0,
    Math.min(Math.floor(layout.left / COLUMN_WIDTH), GRID_COLUMNS - 1),
  );
}

export function getSpan(layout: LayoutRect): number {
  const col = getColumn(layout);
  return Math.max(
    1,
    Math.min(Math.round(layout.width / COLUMN_WIDTH), GRID_COLUMNS - col),
  );
}

export function setMaxHeight(
  maxHeights: number[],
  layout: LayoutRect,
): number[] {
  const [col, right] = getColumnRange(layout);
  for (let i = col; i <= right; i++) {
    maxHeights[i] = Math.max(maxHeights[i], layout.top + layout.height);
  }
  return maxHeights;
}

export function getMaxHeight(maxHeights: number[], layout: LayoutRect): number {
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
  movingInSession: AbsoluteLayout | null,
  moving: AbsoluteLayout | null,
  isOver = false,
): Record<string, AbsoluteLayout> {
  const sorted = Object.entries(items)
    .filter(([id]) => id !== movingInSession?.id)
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

  if (movingInSession && isOver) {
    const insertAt = sorted.findIndex((layout) =>
      collision(layout, movingInSession),
    );
    if (insertAt === -1) {
      sorted.push({
        ...movingInSession,
        idx: generateKeyBetween(sorted.at(-1)?.idx ?? null, null),
      });
    } else {
      sorted.splice(insertAt, 0, {
        ...movingInSession,
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

  // if (moving) {
  //   console.log("-", JSON.stringify(moving, null, 2));
  //   results[moving.id] = {
  //     ...results[moving.id],
  //     left: moving.left,
  //     top: moving.top,
  //   };
  // }

  return results;
}
