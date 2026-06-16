"use client";

import { Layout } from "@/types/template";
import { Active, useDndContext } from "@dnd-kit/core";
import { generateKeyBetween } from "fractional-indexing";
import { createContext, useContext, useMemo, useRef } from "react";
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
  const col = Math.max(0, Math.min(layout.x, GRID_COLUMNS - 1));
  const span = Math.max(1, Math.min(layout.width, GRID_COLUMNS - col));
  const right = col + span - 1;
  for (let i = col; i <= right; i++) {
    maxHeights[i] = Math.max(maxHeights[i], layout.y + layout.height);
  }
  return maxHeights;
}

function getMaxHeight(maxHeights: number[], layout: Layout) {
  const col = Math.max(0, Math.min(layout.x, GRID_COLUMNS - 1));
  const span = Math.max(1, Math.min(layout.width, GRID_COLUMNS - col));
  const right = col + span - 1;
  return Math.max(...maxHeights.slice(col, right + 1));
}

function collision(a: GridLayout, b: GridLayout) {
  if (a.x + a.width <= b.x) return false;
  if (a.x >= b.x + b.width) return false;
  if (a.y + a.height <= b.y) return false;
  if (a.y >= b.y + b.height) return false;
  return true;
}

function useComputeLayouts(items: Record<string, Layout>) {
  const moving = useMoving();
  const yMapRef = useRef(new Map<string, number>());
  const [heightMap, heightMapActions] = useMap<string, number>();

  const computedLayouts = useMemo(() => {
    const baseLayouts: Array<GridLayout> = Object.entries(items).map(
      ([id, layout]) => ({
        id,
        x: layout.x,
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

    // console.log("Sorted layouts:", JSON.stringify(sorted, null, 2));
    // console.log("Moving layout:", JSON.stringify(moving, null, 2));
    if (moving) {
      const movingIndex = sorted.findIndex((layout) =>
        collision(layout, moving!),
      );

      console.log("--", movingIndex);
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

    for (const item of sorted) {
      const maxHeight = getMaxHeight(maxHeights, item);
      yMapRef.current.set(item.id, maxHeight);
      item.y = maxHeight;
      maxHeights = setMaxHeight(maxHeights, item);
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
    return results;
  }, [items, heightMap, moving]) as Record<string, GridLayout>;

  return [computedLayouts, heightMapActions.set] as const;
}

interface GridLayoutProviderProps {
  layoutMap: Record<string, Layout>;
  children: React.ReactNode;
}

export function GridLayoutProvider({
  layoutMap,
  children,
}: GridLayoutProviderProps) {
  const [computedLayouts, setHeight] = useComputeLayouts(layoutMap);

  // console.log("Computed layouts:", JSON.stringify(computedLayouts, null, 2));

  return (
    <GridLayoutContext.Provider value={{ computedLayouts, setHeight }}>
      {children}
    </GridLayoutContext.Provider>
  );
}

function useMoving() {
  const { active } = useDndContext();
  return useMemo<GridLayout | null>(() => {
    return getGridLayout(active);
  }, [active?.rect.current.translated]);
}

function getGridLayout(active: Active | null): GridLayout | null {
  if (!active) return null;
  if (!active.rect.current.initial) return null;
  if (!active.rect.current.translated) return null;
  if (!active.data.current) return null;

  const layout = active.data.current.layout as GridLayout;
  const id = active.data.current.id as string;
  const transformX =
    active.rect.current.translated.left - active.rect.current.initial.left;
  const transformY =
    active.rect.current.translated.top - active.rect.current.initial.top;

  const newX = Math.round(layout.x + transformX / COLUMN_WIDTH);
  const clamped = Math.max(0, Math.min(newX, GRID_COLUMNS - layout.width));
  const newY = layout.y + transformY;

  return { ...layout, x: clamped, y: newY };
}
