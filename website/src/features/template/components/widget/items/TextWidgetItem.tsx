"use client";

import { Input } from "@/components/ui/input";
import type { FieldComponentProps } from "@/types/widget";

export function TextWidgetItem({
  widget,
  value,
  onChange,
}: FieldComponentProps<string>) {
  const placeholder = widget.placeholder ?? "Enter text…";

  return (
    <Input
      id={widget.id}
      type="text"
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}
