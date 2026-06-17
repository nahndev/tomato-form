"use client";

import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import clsx from "clsx";
import { GripVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  AbsoluteLayout,
  useGridLayoutContext,
} from "./GridLayoutContext";

interface GridItemProps {
  id: string;
  children: React.ReactNode;
}

export function GridItem({ id, children }: GridItemProps) {
  const { computedLayouts, setHeight } = useGridLayoutContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const [keepLayout, setKeepLayout] = useState<AbsoluteLayout | null>(null);
  const layout = computedLayouts[id];

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
    });

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setHeight(id, entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [id, setHeight]);

  // useDndMonitor({
  //   onDragStart({ active }) {
  //     if (active.id === id) {
  //       setKeepLayout(layout);
  //     }
  //   },
  //   onDragEnd({ active }) {
  //     setKeepLayout(null);
  //   },
  // });

  const translateX = layout.left;
  const translateY = layout.top;

  return (
    <div
      className={clsx(
        "border-2 border-slate-500",
        !isDragging && "duration-75",
      )}
      style={{
        position: "absolute",
        left: translateX,
        top: translateY,
        width: `${layout.width}px`,
        zIndex: isDragging ? 50 : undefined,
      }}
    >
      <div ref={contentRef} className="h-min w-full grid">
        <div
          ref={setNodeRef}
          className={cn(
            "relative",
            "w-full",
            "group rounded-lg border bg-card p-3 transition-colors",
            "border-primary ring-1 ring-primary",
            isDragging && "shadow-lg",
          )}
        >
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="mt-0.5 shrink-0 cursor-grab text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="size-4" />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}
