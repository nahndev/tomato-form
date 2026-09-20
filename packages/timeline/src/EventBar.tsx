import { useDraggable } from "@dnd-kit/react";
import clsx from "clsx";
import { EventInterface, SubjectInterface, TimelineDndType } from "./types";

export interface EventBarProps {
  event: EventInterface;
  subject?: SubjectInterface;
}

export function EventBar({ event, subject }: EventBarProps) {
  const { ref, isDragging } = useDraggable({
    id: event.uuid,
    type: TimelineDndType.EVENT,
  });

  return (
    <div
      ref={ref}
      className={clsx(
        "flex h-full min-w-0 cursor-grab flex-row items-center justify-between gap-2 rounded-md px-2 text-xs font-medium text-white shadow-sm active:cursor-grabbing",
        isDragging ? "opacity-70" : "duration-300",
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
            <span className="text-[9px]">{subject.name[0]?.toUpperCase()}</span>
          )}
        </span>
      )}
    </div>
  );
}
