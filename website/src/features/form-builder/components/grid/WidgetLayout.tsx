"use client";

import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { GripVertical } from "lucide-react";
import { useEffect, useRef } from "react";
import { useWidgetDraggable } from "../../hooks/useWidgetDraggable";
import { DRAGGING_Z_INDEX } from "../../libs/grid-layout/constants";
import { useSessionLayoutContext } from "./SessionLayoutContext";

interface WidgetLayoutProps {
  id: string;
  children: React.ReactNode;
}

export function WidgetLayout({ id, children }: WidgetLayoutProps) {
  const { computedLayouts, setHeight, session } = useSessionLayoutContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const layout = computedLayouts[id];
  // console.log(JSON.stringify(computedLayouts, null, 2));

  const { attributes, listeners, setNodeRef, isDragging } = useWidgetDraggable(
    id,
    layout,
  );

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

  // console.log(translateX, translateY);

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
