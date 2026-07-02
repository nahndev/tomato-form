"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WidgetPropertyFieldProps } from "@/features/template/components/toolbar/property/types";
import { useState } from "react";

/** Placeholder text shown inside the empty input. */
export function PlaceholderDescriptor({ value, onChange }: WidgetPropertyFieldProps) {
  const [text, setText] = useState(value.placeholder ?? "");

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="prop-placeholder">Placeholder</Label>
      <Input
        id="prop-placeholder"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => onChange(text || undefined)}
        placeholder="Placeholder text…"
      />
    </div>
  );
}
