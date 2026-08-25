"use client";

import { Input } from "@/components/ui/input";
import type { FieldComponentProps } from "@/types/widget";

/** Value is an "HH:mm" time-only string. */
export function TimeWidgetItem({
  widget,
  value,
  onChange,
}: FieldComponentProps<string>) {
  return (
    <Input
      id={widget.id}
      type="time"
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}
