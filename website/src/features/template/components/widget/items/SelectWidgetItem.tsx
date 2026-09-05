"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FieldComponentProps } from "@/types/widget";

export function SelectWidgetItem({
  widget,
  value,
  onChange,
}: FieldComponentProps<string>) {
  const options = widget.options ?? [];

  return (
    <Select value={value ?? ""} onValueChange={(v) => onChange?.(v)}>
      <SelectTrigger id={widget.id}>
        <SelectValue placeholder="Select…" />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
