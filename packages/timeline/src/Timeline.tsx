import clsx from "clsx";
import { useId, useMemo, useState } from "react";
import { v4 } from "uuid";
import { DEFAULT_EVENT_COLOR, DEFAULT_EVENT_TITLE } from "./constants";
import { TimelineContent } from "./TimelineContent";
import { TimelineHeader } from "./TimelineHeader";
import { EventInterface, SubjectInterface, UUID } from "./types";
import { WEEK_MS, getStartOfWeek } from "./utils";

export interface TimelineProps {
  subjects: SubjectInterface[];
  events: EventInterface[];
  onEventMove?: (uuid: UUID, start: number, end: number) => void;
  onEventCreate?: (event: EventInterface) => void;
  id?: string;
  className?: string;
}

export function Timeline({
  subjects,
  events,
  onEventMove,
  onEventCreate,
  id,
  className,
}: TimelineProps) {
  const generatedId = useId();
  const instanceId = id ?? generatedId;
  const [weekStart, setWeekStart] = useState<number>(() =>
    getStartOfWeek(Date.now()),
  );
  const [selectedSubjectUuids, setSelectedSubjectUuids] = useState<Set<UUID>>(
    () => new Set(),
  );

  const filteredEvents = useMemo(() => {
    if (selectedSubjectUuids.size === 0) return events;
    return events.filter((event) => selectedSubjectUuids.has(event.subject));
  }, [events, selectedSubjectUuids]);

  const subjectMap = useMemo(
    () => new Map(subjects.map((subject) => [subject.uuid, subject])),
    [subjects],
  );

  const handleToggleSubject = (uuid: UUID) => {
    setSelectedSubjectUuids((current) => {
      const next = new Set(current);
      if (next.has(uuid)) {
        next.delete(uuid);
      } else {
        next.add(uuid);
      }
      return next;
    });
  };

  const handleCreateAtDay = (start: number, end: number) => {
    onEventCreate?.({
      uuid: v4(),
      start,
      end,
      subject: subjects[0]?.uuid ?? "",
      title: DEFAULT_EVENT_TITLE,
      color: DEFAULT_EVENT_COLOR,
    });
  };

  return (
    <div
      className={clsx(
        "flex h-full flex-col overflow-hidden rounded-md border border-border/50",
        className,
      )}
    >
      <TimelineHeader
        weekStart={weekStart}
        onPrevWeek={() => setWeekStart((current) => current - WEEK_MS)}
        onNextWeek={() => setWeekStart((current) => current + WEEK_MS)}
        onResetWeek={() => setWeekStart(getStartOfWeek(Date.now()))}
        subjects={subjects}
        selectedSubjectUuids={selectedSubjectUuids}
        onToggleSubject={handleToggleSubject}
      />
      <TimelineContent
        id={instanceId}
        weekStart={weekStart}
        events={filteredEvents}
        subjectMap={subjectMap}
        onEventMove={onEventMove}
        onCreateAtDay={handleCreateAtDay}
      />
    </div>
  );
}
