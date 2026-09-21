import { useDraggable } from "@dnd-kit/react";
import clsx from "clsx";
import { Resizable, ResizeCallback, ResizeStartCallback } from "re-resizable";
import { useState } from "react";
import { EventInterface, SubjectInterface, TimelineDndType } from "./types";

export type ResizeHandle = "left" | "right";

export interface EventBarProps {
  event: EventInterface;
  subject?: SubjectInterface;
  onResizeEnd?: (handle: ResizeHandle, deltaX: number) => void;
}

function isResizeHandle(direction: string): direction is ResizeHandle {
  return direction === "left" || direction === "right";
}

const resizeHandleClassName =
  "h-full w-2 cursor-ew-resize touch-none select-none";

export function EventBar({ event, subject, onResizeEnd }: EventBarProps) {
  const { ref, isDragging } = useDraggable({
    id: event.uuid,
    type: TimelineDndType.EVENT,
  });
  const [resizingHandle, setResizingHandle] = useState<ResizeHandle | null>(
    null,
  );

  const handleResizeStart: ResizeStartCallback = (_pointerEvent, direction) => {
    if (!isResizeHandle(direction)) return;
    setResizingHandle(direction);
  };

  const handleResizeStop: ResizeCallback = (
    _pointerEvent,
    direction,
    _el,
    delta,
  ) => {
    setResizingHandle(null);
    if (!isResizeHandle(direction) || delta.width === 0) return;
    // re-resizable anchors on the opposite edge, so "left" delta grows negative
    // as the pointer moves right; flip it back to raw pointer-movement terms.
    onResizeEnd?.(direction, direction === "left" ? -delta.width : delta.width);
  };

  return (
    <div
      className={clsx(
        "flex flex-row",
        resizingHandle === "left" ? "justify-end" : "justify-start",
      )}
    >
      <Resizable
        size={{ width: "100%", height: "100%" }}
        enable={{
          left: Boolean(onResizeEnd),
          right: Boolean(onResizeEnd),
        }}
        handleStyles={{ left: { left: 0 }, right: { right: 0 } }}
        handleComponent={{
          left: onResizeEnd ? (
            <div
              role="separator"
              aria-label="Resize start"
              className={resizeHandleClassName}
            />
          ) : undefined,
          right: onResizeEnd ? (
            <div
              role="separator"
              aria-label="Resize end"
              className={resizeHandleClassName}
            />
          ) : undefined,
        }}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        className="flex flex-row items-center justify-between gap-2 px-2"
      >
        <div
          ref={ref}
          className={clsx(
            "relative h-full w-full cursor-grab rounded-md text-xs font-medium text-white shadow-sm active:cursor-grabbing",
            isDragging || resizingHandle ? "opacity-70" : "duration-300",
          )}
          style={{ backgroundColor: event.color }}
        >
          <span className="truncate">{event.title}</span>
          {subject && (
            <span
              title={subject.name}
              className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/20"
            >
              {subject.avatar ? (
                <img
                  src={subject.avatar}
                  alt={subject.name}
                  className="size-full object-cover"
                />
              ) : (
                <span className="text-[9px]">
                  {subject.name[0]?.toUpperCase()}
                </span>
              )}
            </span>
          )}
        </div>
      </Resizable>
    </div>
  );
}
