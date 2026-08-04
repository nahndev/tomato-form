import { GridLayout, Widget } from "@/types/template";
import { generateKeyBetween } from "fractional-indexing";
import * as R from "remeda";
import { COLUMN_WIDTH, GRID_COLUMNS } from "./constants";
import { AbsoluteLayout } from "./types";

export class LayoutIdx {
  static getInsertIdx(
    layouts: Record<string, GridLayout>,
    before: Widget | null,
  ): string {
    console.log(before);
    const ordered = R.pipe(
      R.entries(layouts),
      R.sortBy(([, layout]) => layout.idx),
    );

    if (before) {
      const index = ordered.findIndex(([id]) => id === before.id);
      const [, { idx: prevIdx }] = ordered[index] ?? [null, { idx: null }];
      const [, { idx: nextIdx }] = ordered[index + 1] ?? [null, { idx: null }];
      return generateKeyBetween(prevIdx, nextIdx);
    }

    return generateKeyBetween(R.last(ordered)?.[1].idx ?? null, null);
  }
}

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

export function getNewIdx(layouts: Record<string, GridLayout>) {
  console.log(Object.entries(layouts));
  const lastIdx = Object.entries(layouts)
    .map(([, layout]) => layout.idx)
    .sort()
    .pop();
  return generateKeyBetween(lastIdx ?? null, null);
}

export function getColumnRange(layout: LayoutRect): [number, number] {
  const col = getColumn(layout);
  const span = getSpan(layout);
  return [col, col + span - 1];
}

export function getColumn(layout: LayoutRect): number {
  return Math.max(
    0,
    Math.min(
      Math.floor(layout.left / COLUMN_WIDTH),
      GRID_COLUMNS - Math.floor(layout.width / COLUMN_WIDTH),
    ),
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
