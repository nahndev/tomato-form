import { EventInterface } from "./types";

export const DAY_MS = 24 * 60 * 60 * 1000;
export const WEEK_DAYS = 7;
export const WEEK_MS = WEEK_DAYS * DAY_MS;

/** Start (local midnight, Monday) of the week containing `timestamp`. */
export function getStartOfWeek(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay(); // 0 (Sun) - 6 (Sat)
  const diffToMonday = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diffToMonday);
  return date.getTime();
}

export function getWeekDays(weekStart: number): number[] {
  return Array.from(
    { length: WEEK_DAYS },
    (_, index) => weekStart + index * DAY_MS,
  );
}

/** Round `value` to the nearest multiple of `step`. */
export function snapToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

export function formatDayLabel(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
  });
}

export function formatRangeLabel(weekStart: number): string {
  const start = new Date(weekStart);
  const end = new Date(weekStart + (WEEK_DAYS - 1) * DAY_MS);
  const sameMonth = start.getMonth() === end.getMonth();

  const startLabel = start.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const endLabel = end.toLocaleDateString(
    undefined,
    sameMonth
      ? { day: "numeric", year: "numeric" }
      : { month: "short", day: "numeric", year: "numeric" },
  );
  return `${startLabel} - ${endLabel}`;
}

export interface EventGridPosition {
  leftPercent: number; // 0-100, continuous position within the week
  widthPercent: number; // 0-100
}

/** Continuous (non-day-snapped) position of `event` within `weekStart`'s week, clamped to its bounds, or `null` if it doesn't overlap that week at all. */
export function getEventGridPosition(
  event: EventInterface,
  weekStart: number,
): EventGridPosition | null {
  const weekEnd = weekStart + WEEK_MS;
  if (event.end <= weekStart || event.start >= weekEnd) return null;

  const clampedStart = Math.max(event.start, weekStart);
  const clampedEnd = Math.min(event.end, weekEnd);
  return {
    leftPercent: ((clampedStart - weekStart) / WEEK_MS) * 100,
    widthPercent: ((clampedEnd - clampedStart) / WEEK_MS) * 100,
  };
}
