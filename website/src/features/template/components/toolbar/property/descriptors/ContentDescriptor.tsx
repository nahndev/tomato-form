"use client";

import { Label } from "@/components/ui/label";
import type { WidgetPropertyFieldProps } from "@/features/template/components/toolbar/property/types";
import { useState } from "react";

/** Static display text editor for the `label` widget. */
export function ContentDescriptor({ value, onChange }: WidgetPropertyFieldProps) {
  const [text, setText] = useState(value.content ?? "");

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="prop-content">Content</Label>
      <textarea
        id="prop-content"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => onChange(text || undefined)}
        rows={4}
        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        placeholder="Text shown to the person filling out the form…"
      />
    </div>
  );
}
