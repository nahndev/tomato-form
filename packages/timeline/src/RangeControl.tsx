import clsx from "clsx";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { formatRangeLabel } from "./utils";

export interface RangeControlProps {
  weekStart: number;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onResetWeek: () => void;
}

const buttonClassName =
  "inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-border/50 text-foreground/70 transition-colors hover:bg-muted hover:text-foreground";

export function RangeControl({
  weekStart,
  onPrevWeek,
  onNextWeek,
  onResetWeek,
}: RangeControlProps) {
  return (
    <div className="flex flex-row items-center gap-2">
      <button
        type="button"
        aria-label="Previous week"
        className={buttonClassName}
        onClick={onPrevWeek}
      >
        <ChevronLeft className="size-4" />
      </button>
      <span className="min-w-36 text-center text-sm font-medium">
        {formatRangeLabel(weekStart)}
      </span>
      <button
        type="button"
        aria-label="Next week"
        className={buttonClassName}
        onClick={onNextWeek}
      >
        <ChevronRight className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Reset to current week"
        className={clsx(buttonClassName, "ml-1")}
        onClick={onResetWeek}
      >
        <RotateCcw className="size-3.5" />
      </button>
    </div>
  );
}
