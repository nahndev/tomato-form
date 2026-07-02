"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WidgetPropertyFieldProps } from "@/features/template/components/toolbar/property/types";
import { useState } from "react";

/** Target URL editor for the `button` widget. */
export function UrlDescriptor({ value, onChange }: WidgetPropertyFieldProps) {
  const [text, setText] = useState(value.url ?? "");

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="prop-url">Link URL</Label>
      <Input
        id="prop-url"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => onChange(text || undefined)}
        placeholder="https://…"
      />
    </div>
  );
}
