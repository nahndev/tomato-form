"use client";

import { GridLayout } from "@/types/template";
import { useDndMonitor } from "@dnd-kit/core";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { generateKeyBetween } from "fractional-indexing";
import { createContext, useContext, useMemo, useState } from "react";
import { useMap } from "usehooks-ts";

export const GRID_COLUMNS = 4;
export const COLUMN_WIDTH = 200; // px per column

export interface AbsoluteLayout {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  idx: string;
  isStatic?: boolean;
  isFullWidth?: boolean;
}

interface GridLayoutContextValue {
  computedLayouts: Record<string, AbsoluteLayout>;
  setHeight: (id: string, height: number) => void;
}

const GridLayoutContext = createContext<GridLayoutContextValue | null>(null);

export function useGridLayoutContext() {
  const ctx = useContext(GridLayoutContext);
  if (!ctx)
    throw new Error("useGridLayoutContext must be inside GridLayoutProvider");
  return ctx;
}

function getColumnRange(layout: AbsoluteLayout): [number, number] {
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

function setMaxHeight(
  maxHeights: number[],
  layout: AbsoluteLayout,
): number[] {
  const [col, right] = getColumnRange(layout);
  for (let i = col; i <= right; i++) {
    maxHeights[i] = Math.max(maxHeights[i], layout.top + layout.height);
  }
  return maxHeights;
}

function getMaxHeight(
  maxHeights: number[],
  layout: AbsoluteLayout,
): number {
  const [col, right] = getColumnRange(layout);
  return Math.max(...maxHeights.slice(col, right + 1));
}

function collision(a: AbsoluteLayout, b: AbsoluteLayout): boolean {
  return (
    a.left < b.left + b.width &&
    a.left + a.width > b.left &&
    a.top < b.top + b.height &&
    a.top + a.height > b.top
  );
}

function useComputeLayouts(
  items: Record<string, GridLayout>,
  moving: AbsoluteLayout | null = null,
) {
  const [heightMap, heightMapActions] = useMap<string, number>();

  const computedLayouts = useMemo(() => {
    const sorted = Object.entries(items)
      .filter(([id]) => id !== moving?.id)
      .map(([id, layout]): AbsoluteLayout => ({
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
      }))
      .sort((a, b) => (a.idx > b.idx ? 1 : -1));

    if (moving) {
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
            sorted[insertAt].idx,
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
  }, [items, heightMap, moving]);

  return [computedLayouts, heightMapActions.set] as const;
}

interface GridLayoutProviderProps {
  layoutMap: Record<string, GridLayout>;
  children: React.ReactNode;
  onMoveWidget: (id: string, column: number, idx: string) => void;
}

export function GridLayoutProvider({
  layoutMap,
  children,
  onMoveWidget,
}: GridLayoutProviderProps) {
  const [initial, setInitial] = useState<AbsoluteLayout | null>(null);
  const [delta, setDelta] = useState<Coordinates | null>(null);
  const moving = useMemo(
    () =>
      initial && delta
        ? ({
            ...initial,
            left: initial.left + delta.x,
            top: initial.top + delta.y,
          } as AbsoluteLayout)
        : null,
    [initial, delta],
  );
  const [computedLayouts, setHeight] = useComputeLayouts(layoutMap, moving);

  useDndMonitor({
    onDragStart({ active }) {
      const layout = computedLayouts[active.id as string];
      if (layout) setInitial(layout);
    },
    onDragMove({ delta }) {
      setDelta(delta);
    },
    onDragEnd() {
      if (moving) {
        const newLayout = computedLayouts[moving.id];
        const column = Math.floor(moving.left / COLUMN_WIDTH);
        onMoveWidget(moving.id, column, newLayout.idx);
      }
      setInitial(null);
      setDelta(null);
    },
  });

  return (
    <GridLayoutContext.Provider value={{ computedLayouts, setHeight }}>
      {children}
    </GridLayoutContext.Provider>
  );
}
