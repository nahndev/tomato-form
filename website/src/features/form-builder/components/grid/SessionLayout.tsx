"use client";

import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { useRef } from "react";
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
  const boxRef = useRef<HTMLDivElement>(null);
  const { sessionId, containerHeight, setPosition } = useSessionLayoutContext();

  const { setNodeRef, over } = useDroppable({ id: sessionId });


  return (
    <div
      ref={setNodeRef}
      className={clsx(className, "z-0 bg-gray-500")}
      style={{
        position: "relative",
        width: COLUMN_WIDTH * GRID_COLUMNS,
        height: containerHeight,
        minHeight: CONTAINER_MIN_HEIGHT,
      }}
    >
      <div ref={boxRef}>{children}</div>
    </div>
  );
}
