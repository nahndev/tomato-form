"use client";

import { useEffect, useRef } from "react";
import { GRID_COLUMNS, useGridLayoutContext } from "./GridLayoutContext";

interface GridItemProps {
  id: string;
  children: React.ReactNode;
  isDragging?: boolean;
}

export function GridItem({ id, children, isDragging }: GridItemProps) {
  const { computedLayouts, setHeight } = useGridLayoutContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const layout = computedLayouts.get(id);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setHeight(id, entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [id, setHeight]);

  if (!layout) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: `${(layout.x / GRID_COLUMNS) * 100}%`,
        top: layout.y,
        width: `${(layout.width / GRID_COLUMNS) * 100}%`,
        zIndex: isDragging ? 50 : undefined,
      }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
