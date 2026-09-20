import { RangeControl } from "./RangeControl";
import { SubjectFilter } from "./SubjectFilter";
import { SubjectInterface, UUID } from "./types";

export interface TimelineHeaderProps {
  weekStart: number;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onResetWeek: () => void;
  subjects: SubjectInterface[];
  selectedSubjectUuids: Set<UUID>;
  onToggleSubject: (uuid: UUID) => void;
}

export function TimelineHeader({
  weekStart,
  onPrevWeek,
  onNextWeek,
  onResetWeek,
  subjects,
  selectedSubjectUuids,
  onToggleSubject,
}: TimelineHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-4 border-b border-border/50 px-3 py-2">
      <RangeControl
        weekStart={weekStart}
        onPrevWeek={onPrevWeek}
        onNextWeek={onNextWeek}
        onResetWeek={onResetWeek}
      />
      <SubjectFilter
        subjects={subjects}
        selected={selectedSubjectUuids}
        onToggle={onToggleSubject}
      />
    </div>
  );
}
