"use client";

import { Input } from "@/components/ui/input";
import type { FieldComponentProps } from "@/features/template/components/widget/types";

export function Field({
  widgetId,
  properties,
  mode,
  value,
  onChange,
}: FieldComponentProps<string>) {
  const placeholder = properties.placeholder ?? "Enter text…";

  if (mode === "preview") {
    return (
      <div className="mt-2 h-7 w-full rounded-md border border-input bg-muted/30 px-2 py-1 text-xs text-muted-foreground">
        {placeholder}
      </div>
    );
  }

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
