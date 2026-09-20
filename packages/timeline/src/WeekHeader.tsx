import clsx from "clsx";
import { formatDayLabel, getWeekDays } from "./utils";

export interface WeekHeaderProps {
  weekStart: number;
}

function getTodayStart(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
}

export function WeekHeader({ weekStart }: WeekHeaderProps) {
  const days = getWeekDays(weekStart);
  const todayStart = getTodayStart();

  return (
    <div className="grid grid-cols-7 border-b border-border/50">
      {days.map((day) => (
        <div
          key={day}
          className={clsx(
            "px-2 py-1.5 text-center text-xs font-medium text-muted-foreground",
            day === todayStart && "text-primary",
          )}
        >
          {formatDayLabel(day)}
        </div>
      ))}
    </div>
  );
}
