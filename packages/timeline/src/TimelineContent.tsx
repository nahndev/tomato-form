import { WeekContent } from "./WeekContent";
import { WeekHeader } from "./WeekHeader";
import { EventInterface, SubjectInterface, UUID } from "./types";

export interface TimelineContentProps {
  id: string;
  weekStart: number;
  events: EventInterface[];
  subjectMap: Map<UUID, SubjectInterface>;
  onEventMove?: (uuid: UUID, start: number, end: number) => void;
  onEventResize?: (uuid: UUID, start: number, end: number) => void;
  onCreateAtDay?: (start: number, end: number) => void;
}

export function TimelineContent({
  id,
  weekStart,
  events,
  subjectMap,
  onEventMove,
  onEventResize,
  onCreateAtDay,
}: TimelineContentProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <WeekHeader weekStart={weekStart} />
      <WeekContent
        id={id}
        weekStart={weekStart}
        events={events}
        subjectMap={subjectMap}
        onEventMove={onEventMove}
        onEventResize={onEventResize}
        onCreateAtDay={onCreateAtDay}
      />
    </div>
  );
}
