"use client";

import type { FieldComponentProps } from "@/features/template/components/widget/types";

// Value is an epoch in MILLISECONDS (Date.getTime()), not seconds. The
// native <input type="datetime-local"> has no timezone of its own, so the
// conversion below implicitly uses the browser's local timezone.
function epochToLocalInputValue(epochMs: number): string {
  const d = new Date(epochMs);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

function localInputValueToEpoch(inputValue: string): number | undefined {
  if (!inputValue) return undefined;
  const time = new Date(inputValue).getTime();
  return Number.isNaN(time) ? undefined : time;
}

export function DatetimeField({
  widgetId,
  mode,
  value,
  onChange,
}: FieldComponentProps<number>) {
  if (mode === "preview") {
    return (
      <div className="mt-2 h-7 w-full rounded-md border border-input bg-muted/30 px-2 py-1 text-xs text-muted-foreground">
        Select date & time…
      </div>
    );
  }

  return (
    <input
      id={widgetId}
      type="datetime-local"
      value={value != null ? epochToLocalInputValue(value) : ""}
      onChange={(e) => onChange?.(localInputValueToEpoch(e.target.value) as number)}
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
}
