"use client";

import { Input } from "@/components/ui/input";
import type { FieldComponentProps } from "@/features/template/components/widget/types";

/** Value is a "YYYY-MM-DD" date-only string. */
export function DateField({
  widgetId,
  mode,
  value,
  onChange,
}: FieldComponentProps<string>) {
  if (mode === "preview") {
    return (
      <div className="mt-2 h-7 w-full rounded-md border border-input bg-muted/30 px-2 py-1 text-xs text-muted-foreground">
        Select date…
      </div>
    );
  }

  return (
    <Input
      id={widgetId}
      type="date"
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}
