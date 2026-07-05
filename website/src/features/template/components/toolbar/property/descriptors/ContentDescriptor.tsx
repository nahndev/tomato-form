"use client";

import { Label } from "@/components/ui/label";
import { TextEditor } from "@/components/ui/lexical/TextEditor";
import type { WidgetPropertyFieldProps } from "@/features/template/components/toolbar/property/types";

/** Editable text editor for the `label` widget's `content` property. */
export function ContentDescriptor({
  value,
  onChange,
}: WidgetPropertyFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="prop-content">Content</Label>
      <TextEditor
        id="prop-content"
        value={value.content}
        onChange={onChange}
        placeholder="Text shown to the person filling out the form…"
      />
    </div>
  );
}
