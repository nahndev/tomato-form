"use client";

import { Input } from "@/components/ui/input";
import type { FieldComponentProps } from "@/types/widget";

/** Value is a "YYYY-MM-DD" date-only string. */
export function DateWidgetItem({
  widgetId,
  value,
  onChange,
}: FieldComponentProps<string>) {
  return (
    <Input
      id={widgetId}
      type="date"
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}
