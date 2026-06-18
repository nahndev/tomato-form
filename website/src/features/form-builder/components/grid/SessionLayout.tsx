"use client";

import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import {
  COLUMN_WIDTH,
  CONTAINER_MIN_HEIGHT,
  GRID_COLUMNS,
} from "../../libs/grid-layout/constants";
import { useSessionLayoutContext } from "./SessionLayoutContext";

interface SessionLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function SessionLayout({ children, className }: SessionLayoutProps) {
  const { sessionId, containerHeight } = useSessionLayoutContext();

  const { setNodeRef } = useDroppable({ id: sessionId });

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
