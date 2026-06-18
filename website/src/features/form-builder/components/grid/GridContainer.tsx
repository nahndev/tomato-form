"use client";

import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { useMemo } from "react";
import {
  COLUMN_WIDTH,
  CONTAINER_MIN_HEIGHT,
  GRID_COLUMNS,
} from "../../libs/grid-layout/constants";
import { useGridLayoutContext } from "./GridLayoutContext";

interface GridContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function GridContainer({ children, className }: GridContainerProps) {
  const { computedLayouts } = useGridLayoutContext();

  const { setNodeRef } = useDroppable({ id: "droppable" });

  const containerHeight = useMemo(
    () =>
      Object.values(computedLayouts).reduce(
        (acc, layout) => Math.max(acc, layout.top + layout.height),
        0,
      ),
    [computedLayouts],
  );

  return (
    <div
      ref={setNodeRef}
      className={clsx(className, "z-0 bg-gray-300")}
      style={{
        position: "relative",
        width: COLUMN_WIDTH * GRID_COLUMNS,
        height: containerHeight,
        minHeight: CONTAINER_MIN_HEIGHT,
      }}
    >
      {children}
    </div>
  );
}
