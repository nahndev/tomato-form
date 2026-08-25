"use client";

import type { FieldComponentProps } from "@/types/widget";

/** Read-only platform metadata (e.g. created-at, template, submitted-by). Never collects a value. */
export function SystemFieldWidgetItem({
  widget,
}: FieldComponentProps<unknown>) {
  return (
    <p className="mt-2 text-sm text-muted-foreground">
      {widget.label} — set automatically by the system
    </p>
  );
}
