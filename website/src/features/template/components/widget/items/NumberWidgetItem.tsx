"use client";

import { Input } from "@/components/ui/input";
import type { FieldComponentProps } from "@/features/template/components/widget/types";

export function NumberWidgetItem({
  widgetId,
  properties,
  value,
  onChange,
}: FieldComponentProps<number>) {
  const placeholder = properties.placeholder ?? "0";

  return (
    <Input
      id={widgetId}
      type="number"
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.valueAsNumber)}
    />
  );
}
