"use client";

import { Input } from "@/components/ui/input";
import type { FieldComponentProps } from "@/features/template/components/widget/types";

/** Value is an "HH:mm" time-only string. */
export function TimeField({
  widgetId,
  mode,
  value,
  onChange,
}: FieldComponentProps<string>) {
  if (mode === "preview") {
    return (
      <div className="mt-2 h-7 w-full rounded-md border border-input bg-muted/30 px-2 py-1 text-xs text-muted-foreground">
        Select time…
      </div>
    );
  }

  return (
    <Input
      id={widgetId}
      type="time"
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}
