"use client";

import clsx from "clsx";
import { useMemo } from "react";
import {
  COLUMN_WIDTH,
  GRID_COLUMNS,
  useGridLayoutContext,
} from "./GridLayoutContext";

interface GridContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function GridContainer({ children, className }: GridContainerProps) {
  const { computedLayouts } = useGridLayoutContext();

  const containerHeight = useMemo(() => {
    let max = 0;
    for (const layout of Object.values(computedLayouts)) {
      max = Math.max(max, layout.y + layout.height);
    }
    return max;
  }, [computedLayouts]);

  return (
    <div
      className={clsx(className, "z-0")}
      style={{
        position: "relative",
        width: COLUMN_WIDTH * GRID_COLUMNS,
        height: containerHeight,
        minHeight: 100,
      }}
    >
      {children}
      <div className="bg-primary/10 absolute h-[120%] w-full -z-10 grid grid-cols-4">
        {Array.from({ length: GRID_COLUMNS }).map((_, colIndex) => (
          <div
            key={colIndex}
            className={clsx("border-l-2 border-border", {
              "first:border-l-0": colIndex === 0,
            })}
            style={{ width: COLUMN_WIDTH }}
          />
        ))}
      </div>
    </div>
  );
}
