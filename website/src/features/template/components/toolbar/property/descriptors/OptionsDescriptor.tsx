"use client";

import { Label } from "@/components/ui/label";
import type { WidgetPropertyFieldProps } from "@/features/template/components/toolbar/property/types";
import { useState } from "react";

/** Options editor (one per line) shared by select, checkbox, and radio. */
export function OptionsDescriptor({ value, onChange }: WidgetPropertyFieldProps) {
  const [text, setText] = useState((value.options ?? []).join("\n"));

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="prop-options">Options (one per line)</Label>
      <textarea
        id="prop-options"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() =>
          onChange(
            text
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
          )
        }
        rows={4}
        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        placeholder={"Option 1\nOption 2\nOption 3"}
      />
    </div>
  );
}
