"use client";

import { Select } from "@/components/ui/select";
import type { FieldComponentProps } from "@/types/widget";

export function SelectWidgetItem({
  widget,
  value,
  onChange,
}: FieldComponentProps<string>) {
  const options = widget.options ?? [];

  return (
    <Select
      id={widget.id}
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
    >
      <option value="">Select…</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </Select>
  );
}
