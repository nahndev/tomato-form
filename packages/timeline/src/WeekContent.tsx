import { useDragDropMonitor, useDroppable } from "@dnd-kit/react";
import { useMemo, useRef } from "react";
import { ROW_HEIGHT } from "./constants";
import { EventBar } from "./EventBar";
import { EventInterface, SubjectInterface, TimelineDndType, UUID } from "./types";
import { DAY_MS, WEEK_DAYS, getEventGridPosition, getWeekDays } from "./utils";

export interface WeekContentProps {
  id: string;
  weekStart: number;
  events: EventInterface[];
  subjectMap: Map<UUID, SubjectInterface>;
  onEventMove?: (uuid: UUID, start: number, end: number) => void;
  onCreateAtDay?: (start: number, end: number) => void;
}

export function WeekContent({
  id,
  weekStart,
  events,
  subjectMap,
  onEventMove,
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
        .map((event) => ({ event, position: getEventGridPosition(event, weekStart) }))
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

  useDragDropMonitor({
    onDragEnd({ operation: { source } }) {
      if (!isDropTarget || !source || !onEventMove) return;
      const containerRect = containerRef.current?.getBoundingClientRect();
      const sourceRect = source.element?.getBoundingClientRect();
      if (!containerRect || !sourceRect) return;

      const event = events.find((item) => item.uuid === source.id);
      if (!event) return;

      const dayWidth = containerRect.width / WEEK_DAYS;
      const dayIndex = Math.max(
        0,
        Math.min(
          WEEK_DAYS - 1,
          Math.round((sourceRect.left - containerRect.left) / dayWidth),
        ),
      );
      const duration = event.end - event.start;
      const newStart = weekStart + dayIndex * DAY_MS;
      onEventMove(event.uuid, newStart, newStart + duration);
    },
  });

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        dropRef(node);
      }}
      className="flex-1 overflow-y-auto"
    >
      {rows.length === 0 && (
        <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
          No events this week
        </div>
      )}
      {rows.map(({ event, position }) => (
        <div
          key={event.uuid}
          className="grid grid-cols-7 border-b border-border/30"
          style={{ height: ROW_HEIGHT }}
        >
          <div
            style={{ gridColumn: `${position.colStart + 1} / span ${position.colSpan}` }}
            className="min-w-0 p-0.5"
          >
            <EventBar event={event} subject={subjectMap.get(event.subject)} />
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
