"use client";

import { useDndContext } from "@dnd-kit/core";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

export const GRID_COLUMNS = 4;
export const COLUMN_WIDTH = 200; // px per column

export interface GridItemDef {
  id: string;
  x: number;
  width: number;
  idx: number;
}

export interface ComputedLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface GridLayoutContextValue {
  computedLayouts: Map<string, ComputedLayout>;
  setHeight: (id: string, height: number) => void;
}

const GridLayoutContext = createContext<GridLayoutContextValue | null>(null);

export function useGridLayoutContext() {
  const ctx = useContext(GridLayoutContext);
  if (!ctx)
    throw new Error("useGridLayoutContext must be inside GridLayoutProvider");
  return ctx;
}

function computeLayouts(
  items: GridItemDef[],
  heights: Map<string, number>,
  moving: GridItemDef | null,
  movingY: number,
  movingInitialY: number,
): Map<string, ComputedLayout> {
  console.log("moving", moving, movingY);
  const maxHeights = new Array<number>(GRID_COLUMNS).fill(0);
  const sorted = [...items].sort((a, b) => a.idx - b.idx);
  const result = new Map<string, ComputedLayout>();
  let isApplyMoving = false;

  for (const { id, x, width } of sorted) {
    if (id === moving?.id) {
      result.set(id, {
        x,
        y: movingInitialY,
        width,
        height: heights.get(id) ?? 0,
      });
      continue;
    }
    const col = Math.max(0, Math.min(x, GRID_COLUMNS - 1));
    const span = Math.max(1, Math.min(width, GRID_COLUMNS - col));
    const right = col + span - 1;

    let y = 0;
    for (let i = col; i <= right; i++) {
      y = Math.max(y, maxHeights[i]);
    }
    const height = heights.get(id) ?? 0;

    if (
      !isApplyMoving &&
      moving &&
      y + height > movingY &&
      moving.x <= right &&
      moving.x + moving.width - 1 >= col
    ) {
      isApplyMoving = true;
      const movingCol = Math.max(0, Math.min(moving.x, GRID_COLUMNS - 1));
      const movingSpan = Math.max(
        1,
        Math.min(moving.width, GRID_COLUMNS - movingCol),
      );
      const movingRight = movingCol + movingSpan - 1;
      const movingHeight = heights.get(moving.id) ?? 0;

      if (movingCol <= right && movingRight >= col) {
        maxHeights[movingCol] = Math.max(
          maxHeights[movingCol],
          y + movingHeight,
        );
      }
      for (let i = col; i <= right; i++) {
        y = Math.max(y, maxHeights[i]);
      }
    }

    result.set(id, { x: col, y, width: span, height });

    for (let i = col; i <= right; i++) {
      maxHeights[i] = y + height;
    }
  }

  return result;
}

interface GridLayoutProviderProps {
  items: GridItemDef[];
  children: React.ReactNode;
}

export function GridLayoutProvider({
  items,
  children,
}: GridLayoutProviderProps) {
  const heightsRef = useRef<Map<string, number>>(new Map());
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const { active, dragOverlay } = useDndContext();

  const moving = useMemo<GridItemDef | null>(() => {
    if (!active) return null;
    if (!active.rect.current.initial) return null;
    if (!active.rect.current.translated) return null;
    const current = active.data.current?.layout as ComputedLayout;
    const transformX =
      active.rect.current.translated.left - active.rect.current.initial.left;
    const newX = Math.round(current.x + transformX / COLUMN_WIDTH);
    const clamped = Math.max(0, Math.min(newX, GRID_COLUMNS - current.width));

    return {
      id: active.data.current?.id as string,
      x: clamped,
      width: current.width,
      idx: 0,
    };
  }, [active?.rect.current.translated?.left]);

  const movingY = useMemo(() => {
    if (!active) return 0;
    if (!active.rect.current.initial) return 0;
    if (!active.rect.current.translated) return 0;
    const current = active.data.current?.layout as ComputedLayout;
    return (
      current.y +
      active.rect.current.translated.top -
      active.rect.current.initial.top
    );
  }, [active?.rect.current.translated?.top]);
  const movingInitialY = active?.data.current?.layout?.y ?? 0;

  // heightVersion bumps when any height changes, triggering layout recomputation
  const [heightVersion, setHeightVersion] = useState(0);

  const computedLayouts = useMemo(() => {
    // Clean up heights for removed items
    const activeIds = new Set(items.map((i) => i.id));
    for (const id of heightsRef.current.keys()) {
      if (!activeIds.has(id)) heightsRef.current.delete(id);
    }
    return computeLayouts(
      items,
      heightsRef.current,
      moving,
      movingY,
      movingInitialY,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, heightVersion, moving]);

  const setHeight = useCallback((id: string, height: number) => {
    if (heightsRef.current.get(id) === height) return;
    heightsRef.current.set(id, height);
    setHeightVersion((v) => v + 1);
  }, []);

  const value = useMemo(
    () => ({ computedLayouts, setHeight }),
    [computedLayouts, setHeight],
  );

  return (
    <GridLayoutContext.Provider value={value}>
      {children}
    </GridLayoutContext.Provider>
  );
}
