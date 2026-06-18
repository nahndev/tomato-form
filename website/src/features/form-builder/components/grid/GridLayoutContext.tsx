"use client";

import { GridLayout } from "@/types/template";
import { useDndMonitor } from "@dnd-kit/core";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { createContext, useContext, useMemo, useState } from "react";
import { useMap } from "usehooks-ts";
import { COLUMN_WIDTH } from "../../libs/grid-layout/constants";
import { AbsoluteLayout } from "../../libs/grid-layout/types";
import { computeLayouts } from "../../libs/grid-layout/utils";

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

function useComputeLayouts(
  items: Record<string, GridLayout>,
  moving: AbsoluteLayout | null = null
) {
  const [heightMap, heightMapActions] = useMap<string, number>();

  const computedLayouts = useMemo(
    () => computeLayouts(items, heightMap, moving),
    [items, heightMap, moving]
  );

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
    [initial, delta]
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
