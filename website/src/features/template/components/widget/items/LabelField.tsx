"use client";

import { TextEditor } from "@/components/ui/lexical/TextEditor";
import { serializeEditorState } from "@/components/ui/lexical/config";
import type { FieldComponentProps } from "@/features/template/components/widget/types";

/** Read-only static content. Never collects a value. */
export function LabelField({ properties }: FieldComponentProps<unknown>) {
  if (!serializeEditorState(properties.content)) {
    return <p className="mt-2 text-sm text-muted-foreground">Enter content…</p>;
  }

  return (
    <TextEditor
      value={properties.content}
      editable={false}
      className="mt-2 text-sm text-foreground"
    />
  );
}
