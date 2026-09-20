import clsx from "clsx";
import { SubjectInterface, UUID } from "./types";

export interface SubjectFilterProps {
  subjects: SubjectInterface[];
  selected: Set<UUID>;
  onToggle: (uuid: UUID) => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function SubjectFilter({ subjects, selected, onToggle }: SubjectFilterProps) {
  return (
    <div className="flex flex-row items-center -space-x-2">
      {subjects.map((subject) => {
        const isSelected = selected.has(subject.uuid);
        return (
          <button
            key={subject.uuid}
            type="button"
            title={subject.name}
            aria-pressed={isSelected}
            onClick={() => onToggle(subject.uuid)}
            className={clsx(
              "relative size-7 shrink-0 overflow-hidden rounded-full ring-2 ring-background transition-transform hover:z-10 hover:scale-105",
              isSelected && "z-10 ring-primary",
            )}
          >
            {subject.avatar ? (
              <img
                src={subject.avatar}
                alt={subject.name}
                className="size-full object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center bg-muted text-[10px] font-medium text-muted-foreground">
                {getInitials(subject.name)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
