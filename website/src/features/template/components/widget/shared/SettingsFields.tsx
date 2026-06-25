"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { WidgetSettingsFieldsProps } from "@/features/template/components/widget/types";

/** Options editor (one per line) shared by select, checkbox, and radio. */
export function OptionsListEditor({ value, onChange }: WidgetSettingsFieldsProps) {
  const [text, setText] = useState((value.options ?? []).join("\n"));

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="prop-options">Options (one per line)</Label>
      <textarea
        id="prop-options"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() =>
          onChange({
            options: text
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
          })
        }
        rows={4}
        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        placeholder={"Option 1\nOption 2\nOption 3"}
      />
    </div>
  );
}

/** Static display text editor for the `label` widget. */
export function ContentEditor({ value, onChange }: WidgetSettingsFieldsProps) {
  const [text, setText] = useState(value.content ?? "");

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="prop-content">Content</Label>
      <textarea
        id="prop-content"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => onChange({ content: text || undefined })}
        rows={4}
        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        placeholder="Text shown to the person filling out the form…"
      />
    </div>
  );
}

/** Target URL editor for the `button` widget. */
export function UrlField({ value, onChange }: WidgetSettingsFieldsProps) {
  const [text, setText] = useState(value.url ?? "");

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="prop-url">Link URL</Label>
      <Input
        id="prop-url"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => onChange({ url: text || undefined })}
        placeholder="https://…"
      />
    </div>
  );
}
