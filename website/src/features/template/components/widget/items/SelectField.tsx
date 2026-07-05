"use client";

import { Select } from "@/components/ui/select";
import type { FieldComponentProps } from "@/features/template/components/widget/types";

export function SelectField({
  widgetId,
  properties,
  mode,
  value,
  onChange,
}: FieldComponentProps<string>) {
  const options = properties.options ?? [];

  if (mode === "preview") {
    return (
      <div className="mt-2 flex h-7 w-full items-center justify-between rounded-md border border-input bg-muted/30 px-2 text-xs text-muted-foreground">
        <span>{options[0] ?? "Select…"}</span>
        <span>▾</span>
      </div>
    );
  }

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
