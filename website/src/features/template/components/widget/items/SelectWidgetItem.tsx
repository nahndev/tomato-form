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
  const options = [...(widget.options ?? [])].sort((a, b) =>
    a.index < b.index ? -1 : 1,
  );

  return (
    <Select value={value ?? ""} onValueChange={(v) => onChange?.(v)}>
      <SelectTrigger id={widget.id}>
        <SelectValue placeholder="Select…" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.key} value={option.key}>
            {option.value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
