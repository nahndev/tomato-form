"use client";

import { Layout } from "@/types/template";
import { useDndContext } from "@dnd-kit/core";
import { generateKeyBetween } from "fractional-indexing";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

function getMaxHeight(maxHeights: number[], layout: GridLayout) {
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

function computeLayouts(
  items: Record<string, GridLayout>,
  movingLayout: GridLayout | null = null,
): Record<string, GridLayout> {
  const result: Record<string, GridLayout> = {};
  let maxHeights = new Array<number>(GRID_COLUMNS).fill(0);
  const sorted = Object.values(items)
    .filter((item) => item.id !== movingLayout?.id)
    .sort((a, b) => (a.idx > b.idx ? 1 : -1));
  let newIdx = null;
  if (movingLayout) {
    const index = movingLayout
      ? sorted.findIndex((item) => collision(item, movingLayout))
      : -1;
    const newIndex = generateKeyBetween(
      sorted[index - 1]?.idx,
      sorted[index]?.idx,
    );
    sorted.splice(index, 0, { ...movingLayout, idx: newIndex });
  }

  for (const item of sorted) {
    const maxHeight = getMaxHeight(maxHeights, item);
    result[item.id] = { ...item, y: maxHeight };
    maxHeights = setMaxHeight(maxHeights, result[item.id]);
  }

  if (movingLayout) {
    result[movingLayout.id] = { ...items[movingLayout.id], idx: newIdx! };
  }
  return result;
}

interface GridLayoutProviderProps {
  layoutMap: Record<string, Layout>;
  children: React.ReactNode;
}

export function GridLayoutProvider({
  layoutMap,
  children,
}: GridLayoutProviderProps) {
  const [version, setVersion] = useState(0);
  const heightsRef = useRef<Record<string, number>>({});

  const [items, setItems] = useState<Record<string, GridLayout>>({});
  const moving = useMoving();

  useEffect(() => {
    console.log("layoutMap changed, recomputing layouts", heightsRef.current);
    setItems((prev) => {
      const next = { ...prev };
      for (const [id, layout] of Object.entries(layoutMap)) {
        const existing = next[id] ?? {
          ...layout,
          id,
          height: heightsRef.current[id] ?? 0,
          y: 0,
        };
        next[id] = { ...existing, ...layout };
      }
      console.log("next", next);
      return computeLayouts(next);
    });
  }, [layoutMap, moving, version]);

  // useEffect(() => {
  //   if (!moving) return;
  //   setItems((prev) => computeLayouts(prev, moving));
  // }, [moving]);

  const setHeight = useCallback((id: string, height: number) => {
    console.log("setting height for", id, "to", height);
    heightsRef.current[id] = height;
    setVersion((v) => v + 1);
  }, []);

  const value = useMemo(
    () => ({ computedLayouts: items, setHeight }),
    [items, setHeight],
  );
  return (
    <GridLayoutContext.Provider value={value}>
      {children}
    </GridLayoutContext.Provider>
  );
}

function useMoving() {
  const { active } = useDndContext();
  return useMemo<GridLayout | null>(() => {
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
  }, [active]);
}
