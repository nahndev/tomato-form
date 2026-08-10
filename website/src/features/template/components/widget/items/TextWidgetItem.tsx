"use client";

import { Input } from "@/components/ui/input";
import type { FieldComponentProps } from "@/features/template/components/widget/types";

export function TextWidgetItem({
  widgetId,
  properties,
  value,
  onChange,
}: FieldComponentProps<string>) {
  const placeholder = properties.placeholder ?? "Enter text…";

  return (
    <Input
      id={widgetId}
      type="text"
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}
