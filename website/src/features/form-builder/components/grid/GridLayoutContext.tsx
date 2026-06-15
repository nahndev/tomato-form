"use client";

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
): Map<string, ComputedLayout> {
  const maxHeights = new Array<number>(GRID_COLUMNS).fill(0);
  const sorted = [...items].sort((a, b) => a.idx - b.idx);
  const result = new Map<string, ComputedLayout>();

  for (const { id, x, width } of sorted) {
    const col = Math.max(0, Math.min(x, GRID_COLUMNS - 1));
    const span = Math.max(1, Math.min(width, GRID_COLUMNS - col));
    const right = col + span - 1;

    let y = 0;
    for (let i = col; i <= right; i++) {
      y = Math.max(y, maxHeights[i]);
    }

    const height = heights.get(id) ?? 0;
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

  // heightVersion bumps when any height changes, triggering layout recomputation
  const [heightVersion, setHeightVersion] = useState(0);

  const computedLayouts = useMemo(() => {
    // Clean up heights for removed items
    const activeIds = new Set(items.map((i) => i.id));
    for (const id of heightsRef.current.keys()) {
      if (!activeIds.has(id)) heightsRef.current.delete(id);
    }
    return computeLayouts(items, heightsRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, heightVersion]);

  const setHeight = useCallback((id: string, height: number) => {
    if (heightsRef.current.get(id) === height) return;
    heightsRef.current.set(id, height);
    setHeightVersion((v) => v + 1);
  }, []);

  const value = useMemo(
    () => ({ computedLayouts, setHeight }),
    [computedLayouts, setHeight],
  );

  console.log("GridLayoutProvider render", { items, computedLayouts, value });

  return (
    <GridLayoutContext.Provider value={value}>
      {children}
    </GridLayoutContext.Provider>
  );
}
