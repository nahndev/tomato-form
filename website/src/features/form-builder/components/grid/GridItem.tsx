"use client";

import { Badge } from "@/components/ui/badge";
import { useDraggable } from "@dnd-kit/core";
import clsx from "clsx";
import { GripVertical } from "lucide-react";
import { useEffect, useRef } from "react";
import { DRAGGING_Z_INDEX } from "../../libs/grid-layout/constants";
import { useGridLayoutContext } from "./GridLayoutContext";

interface GridItemProps {
  id: string;
  children: React.ReactNode;
}

export function GridItem({ id, children }: GridItemProps) {
  const { computedLayouts, setHeight, session } = useGridLayoutContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const layout = computedLayouts[id];

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    disabled: layout.isStatic,
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

  const translateX = layout.left;
  const translateY = layout.top;

  return (
    <div
      className={clsx(!isDragging && "duration-75")}
      style={{
        position: "absolute",
        left: translateX,
        top: translateY,
        width: `${layout.width}px`,
        zIndex: isDragging ? DRAGGING_Z_INDEX : undefined,
      }}
    >
      <div ref={contentRef} className="h-min w-full grid">
        <div ref={setNodeRef} className="relative w-full group">
          <Badge
            variant="outline"
            className="absolute -top-2 right-1 z-10 bg-background text-[10px]"
          >
            {session.name}
          </Badge>
          {!layout.isStatic && (
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="absolute mt-0.5 shrink-0 cursor-grab text-muted-foreground  transition-opacity group-hover:opacity-100 active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="size-4" />
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
