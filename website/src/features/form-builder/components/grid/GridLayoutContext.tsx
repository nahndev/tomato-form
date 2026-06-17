"use client";

import { Layout } from "@/types/template";
import { useDndMonitor } from "@dnd-kit/core";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { generateKeyBetween } from "fractional-indexing";
import { createContext, useContext, useMemo, useRef, useState } from "react";
import { useMap } from "usehooks-ts";

export const GRID_COLUMNS = 4;
export const COLUMN_WIDTH = 200; // px per column

export interface GridLayout {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  idx: string;
}

interface GridLayoutContextValue {
  computedLayouts: Record<string, GridLayout>;
  setHeight: (id: string, height: number) => void;
}

const GridLayoutContext = createContext<GridLayoutContextValue | null>(null);

export function useGridLayoutContext() {
  const ctx = useContext(GridLayoutContext);
  if (!ctx)
    throw new Error("useGridLayoutContext must be inside GridLayoutProvider");
  return ctx;
}

function setMaxHeight(maxHeights: number[], layout: GridLayout) {
  const xIndex = Math.floor(layout.x / COLUMN_WIDTH);
  const col = Math.max(0, Math.min(xIndex, GRID_COLUMNS - 1));
  const span = Math.max(1, Math.min(layout.width, GRID_COLUMNS - col));
  const right = col + span - 1;
  for (let i = col; i <= right; i++) {
    maxHeights[i] = Math.max(maxHeights[i], layout.y + layout.height);
  }
  return maxHeights;
}

function getMaxHeight(maxHeights: number[], layout: Layout) {
  const xIndex = Math.floor(layout.x / COLUMN_WIDTH);
  const col = Math.max(0, Math.min(xIndex, GRID_COLUMNS - 1));
  const span = Math.max(1, Math.min(layout.width, GRID_COLUMNS - col));
  const right = col + span - 1;
  return Math.max(...maxHeights.slice(col, right + 1));
}

function collision(a: GridLayout, b: GridLayout) {
  if (a.x + a.width * COLUMN_WIDTH <= b.x) return false;
  if (a.x >= b.x + b.width * COLUMN_WIDTH) return false;
  if (a.y + a.height <= b.y) return false;
  if (a.y >= b.y + b.height) return false;
  return true;
}

function useComputeLayouts(
  items: Record<string, Layout>,
  moving: GridLayout | null = null,
) {
  // const moving = useMoving();
  const yMapRef = useRef(new Map<string, number>());
  const [heightMap, heightMapActions] = useMap<string, number>();

  const computedLayouts = useMemo(() => {
    const baseLayouts: Array<GridLayout> = Object.entries(items).map(
      ([id, layout]) => ({
        id,
        x: layout.x * COLUMN_WIDTH,
        y: yMapRef.current.get(id) ?? 0,
        width: layout.width,
        height: heightMap.get(id) ?? 0,
        idx: layout.idx,
      }),
    );
    let maxHeights = new Array<number>(GRID_COLUMNS).fill(0);
    const sorted = baseLayouts
      .filter((layout) => layout.id !== moving?.id)
      .sort((a, b) => (a.idx > b.idx ? 1 : -1));

    for (const item of sorted) {
      const maxHeight = getMaxHeight(maxHeights, item);
      item.y = maxHeight;
      maxHeights = setMaxHeight(maxHeights, item);
    }

    if (moving) {
      const movingIndex = sorted.findIndex((layout) =>
        collision(layout, moving!),
      );
      console.log("movingIndex", movingIndex);
      if (movingIndex === -1) {
        sorted.push({
          ...moving,
          idx: generateKeyBetween(sorted[sorted.length - 1]?.idx, null),
        });
      } else {
        sorted.splice(movingIndex, 0, {
          ...moving,
          idx: generateKeyBetween(
            sorted[movingIndex - 1]?.idx,
            sorted[movingIndex]?.idx,
          ),
        });
      }
    }

    console.log(JSON.stringify(sorted, null, 2));

    maxHeights = new Array<number>(GRID_COLUMNS).fill(0);
    for (const item of sorted) {
      const maxHeight = getMaxHeight(maxHeights, item);
      yMapRef.current.set(item.id, maxHeight);
      item.y = maxHeight;
      console.log("maxHeight", item.id, maxHeight);
      maxHeights = setMaxHeight(maxHeights, item);
      console.log("maxHeights", maxHeights);
    }
    const results = Object.fromEntries(
      sorted.map((item) => [
        item.id,
        {
          ...item,
          y: yMapRef.current.get(item.id) ?? 0,
          height: heightMap.get(item.id) ?? 0,
        },
      ]),
    );
    if (moving) {
      results[moving.id] = { ...results[moving.id], x: moving.x, y: moving.y };
    }
    return results;
  }, [items, heightMap, moving]) as Record<string, GridLayout>;

  return [computedLayouts, heightMapActions.set] as const;
}

interface GridLayoutProviderProps {
  layoutMap: Record<string, Layout>;
  children: React.ReactNode;
  onMoveWidget: (id: string, x: number, idx: string) => void;
}

export function GridLayoutProvider({
  layoutMap,
  children,
  onMoveWidget,
}: GridLayoutProviderProps) {
  const [initial, setInitial] = useState<GridLayout | null>(null);
  const [delta, setDelta] = useState<Coordinates | null>(null);
  const moving = useMemo(
    () =>
      initial && delta
        ? ({
            ...initial,
            x: initial.x + delta.x,
            y: initial.y + delta.y,
          } as GridLayout)
        : null,
    [initial, delta],
  );
  const [computedLayouts, setHeight] = useComputeLayouts(layoutMap, moving);
  // console.log(JSON.stringify(computedLayouts, null, 2));

  useDndMonitor({
    onDragStart({ active }) {
      const layout = computedLayouts[active.id as string];
      if (layout) setInitial(layout);
    },
    onDragMove({ active, delta }) {
      setDelta(delta);
    },
    onDragEnd() {
      if (moving) {
        const newLayout = computedLayouts[moving.id];
        const xIndex = Math.floor(moving.x / COLUMN_WIDTH);
        onMoveWidget(moving.id, xIndex, newLayout.idx);
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
