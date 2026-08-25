"use client";

import { Input } from "@/components/ui/input";
import type { FieldComponentProps } from "@/types/widget";

export function NumberWidgetItem({
  widget,
  value,
  onChange,
}: FieldComponentProps<number>) {
  const placeholder = widget.placeholder ?? "0";

  return (
    <Input
      id={widget.id}
      type="number"
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.valueAsNumber)}
    />
  );
}
