import { useDraggable } from "@dnd-kit/react";
import clsx from "clsx";
import { useState } from "react";
import { EventInterface, SubjectInterface, TimelineDndType } from "./types";

export type ResizeHandle = "left" | "right";

export interface EventBarProps {
  event: EventInterface;
  subject?: SubjectInterface;
  onResizeEnd?: (handle: ResizeHandle, deltaX: number) => void;
}

export function EventBar({ event, subject, onResizeEnd }: EventBarProps) {
  const { ref, isDragging } = useDraggable({
    id: event.uuid,
    type: TimelineDndType.EVENT,
  });
  const [resizingHandle, setResizingHandle] = useState<ResizeHandle | null>(null);

  const handlePointerDown =
    (handle: ResizeHandle) => (pointerDownEvent: React.PointerEvent<HTMLDivElement>) => {
      pointerDownEvent.preventDefault();
      pointerDownEvent.stopPropagation();
      const startX = pointerDownEvent.clientX;
      setResizingHandle(handle);

      const handlePointerUp = (pointerUpEvent: PointerEvent) => {
        window.removeEventListener("pointerup", handlePointerUp);
        setResizingHandle(null);
        onResizeEnd?.(handle, pointerUpEvent.clientX - startX);
      };

      window.addEventListener("pointerup", handlePointerUp);
    };

  return (
    <div
      ref={ref}
      className={clsx(
        "relative flex h-full min-w-0 cursor-grab flex-row items-center justify-between gap-2 rounded-md px-2 text-xs font-medium text-white shadow-sm active:cursor-grabbing",
        isDragging || resizingHandle ? "opacity-70" : "duration-300",
      )}
      style={{ backgroundColor: event.color }}
    >
      {onResizeEnd && (
        <div
          role="separator"
          aria-label="Resize start"
          className="absolute inset-y-0 left-0 w-2 cursor-ew-resize touch-none select-none"
          onPointerDown={handlePointerDown("left")}
        />
      )}
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
            <span className="text-[9px]">{subject.name[0]?.toUpperCase()}</span>
          )}
        </span>
      )}
      {onResizeEnd && (
        <div
          role="separator"
          aria-label="Resize end"
          className="absolute inset-y-0 right-0 w-2 cursor-ew-resize touch-none select-none"
          onPointerDown={handlePointerDown("right")}
        />
      )}
    </div>
  );
}
