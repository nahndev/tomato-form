"use client";

import { Select } from "@/components/ui/select";
import type { FieldComponentProps } from "@/features/template/components/widget/types";

export function SelectWidgetItem({
  widgetId,
  properties,
  value,
  onChange,
}: FieldComponentProps<string>) {
  const options = properties.options ?? [];

  return (
    <Select
      id={widgetId}
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
