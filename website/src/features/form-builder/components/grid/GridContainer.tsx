"use client";

import { useMemo } from "react";
import { COLUMN_WIDTH, GRID_COLUMNS, useGridLayoutContext } from "./GridLayoutContext";

interface GridContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function GridContainer({ children, className }: GridContainerProps) {
  const { computedLayouts } = useGridLayoutContext();

  const containerHeight = useMemo(() => {
    let max = 0;
    for (const layout of computedLayouts.values()) {
      max = Math.max(max, layout.y + layout.height);
    }
    return max;
  }, [computedLayouts]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: COLUMN_WIDTH * GRID_COLUMNS,
        height: containerHeight,
        minHeight: 100,
      }}
    >
      {children}
    </div>
  );
}
