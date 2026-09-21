import { useDragDropMonitor, useDroppable } from "@dnd-kit/react";
import { useMemo, useRef } from "react";
import { ROW_HEIGHT, STEP_MS } from "./constants";
import { EventBar, ResizeHandle } from "./EventBar";
import {
  EventInterface,
  SubjectInterface,
  TimelineDndType,
  UUID,
} from "./types";
import {
  DAY_MS,
  WEEK_MS,
  getEventGridPosition,
  getWeekDays,
  snapToStep,
} from "./utils";

export interface WeekContentProps {
  id: string;
  weekStart: number;
  events: EventInterface[];
  subjectMap: Map<UUID, SubjectInterface>;
  onEventMove?: (uuid: UUID, start: number, end: number) => void;
  onEventResize?: (uuid: UUID, start: number, end: number) => void;
  onCreateAtDay?: (start: number, end: number) => void;
}

export function WeekContent({
  id,
  weekStart,
  events,
  subjectMap,
  onEventMove,
  onEventResize,
  onCreateAtDay,
}: WeekContentProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { ref: dropRef, isDropTarget } = useDroppable({
    id,
    accept: TimelineDndType.EVENT,
  });

  const rows = useMemo(
    () =>
      events
        .map((event) => ({
          event,
          position: getEventGridPosition(event, weekStart),
        }))
        .filter(
          (
            row,
          ): row is {
            event: EventInterface;
            position: NonNullable<ReturnType<typeof getEventGridPosition>>;
          } => row.position !== null,
        ),
    [events, weekStart],
  );

  const days = useMemo(() => getWeekDays(weekStart), [weekStart]);

  const handleEventResize = (
    event: EventInterface,
    handle: ResizeHandle,
    deltaX: number,
  ) => {
    if (!onEventResize) return;
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const deltaMs = (deltaX / containerRect.width) * WEEK_MS;
    if (deltaMs === 0) return;

    if (handle === "left") {
      const newStart = Math.min(
        snapToStep(event.start + deltaMs, STEP_MS),
        event.end - STEP_MS,
      );
      if (newStart === event.start) return;
      onEventResize(event.uuid, newStart, event.end);
    } else {
      const newEnd = Math.max(
        snapToStep(event.end + deltaMs, STEP_MS),
        event.start + STEP_MS,
      );
      if (newEnd === event.end) return;
      onEventResize(event.uuid, event.start, newEnd);
    }
  };

  useDragDropMonitor({
    onDragEnd({ operation: { source } }) {
      if (!isDropTarget || !source || !onEventMove) return;
      const containerRect = containerRef.current?.getBoundingClientRect();
      const sourceRect = source.element?.getBoundingClientRect();
      if (!containerRect || !sourceRect) return;

      const event = events.find((item) => item.uuid === source.id);
      if (!event) return;

      const rawOffsetMs =
        ((sourceRect.left - containerRect.left) / containerRect.width) *
        WEEK_MS;
      const clampedOffsetMs = rawOffsetMs;
      const duration = event.end - event.start;
      const newStart = weekStart + snapToStep(clampedOffsetMs, STEP_MS);
      onEventMove(event.uuid, newStart, newStart + duration);
    },
  });

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        dropRef(node);
      }}
      className="overflow-y-auto"
    >
      {rows.length === 0 && (
        <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
          No events this week
        </div>
      )}
      {rows.map(({ event, position }) => (
        <div
          key={event.uuid}
          className="relative flex flex-row border-b border-border/30 max-w-full box-border overflow-x-auto  "
          style={{ height: ROW_HEIGHT }}
        >
          <div
            style={{
              left: `${position.leftPercent}%`,
              width: `${position.widthPercent}%`,
            }}
            className="overflow-hidden absolute"
          >
            <div className="size-full">
              <EventBar
                event={event}
                subject={subjectMap.get(event.subject)}
                onResizeEnd={
                  onEventResize
                    ? (handle, deltaX) =>
                        handleEventResize(event, handle, deltaX)
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      ))}
      <div className="grid grid-cols-7" style={{ height: ROW_HEIGHT }}>
        {days.map((day) => (
          <button
            key={day}
            type="button"
            aria-label="Create event"
            className="group flex items-center justify-center border-r border-dashed border-border/30 text-transparent last:border-r-0 hover:bg-muted/50 hover:text-muted-foreground"
            onClick={() => onCreateAtDay?.(day, day + DAY_MS)}
          >
            <span className="text-lg leading-none">+</span>
          </button>
        ))}
      </div>
    </div>
  );
}
