"use client";

import { TextEditor } from "@/components/ui/lexical/TextEditor";
import { serializeEditorState } from "@/components/ui/lexical/config";
import type { FieldComponentProps } from "@/types/widget";

/** Read-only static content. Never collects a value. */
export function LabelWidgetItem({ widget }: FieldComponentProps<unknown>) {
  if (!serializeEditorState(widget.content)) {
    return <p className="mt-2 text-sm text-muted-foreground">Enter content…</p>;
  }

  return (
    <TextEditor
      value={widget.content}
      editable={false}
      className="mt-2 text-sm text-foreground"
    />
  );
}
