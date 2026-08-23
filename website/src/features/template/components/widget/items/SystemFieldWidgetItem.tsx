"use client";

import type { FieldComponentProps } from "@/types/widget";

/** Read-only platform metadata (e.g. created-at, template, submitted-by). Never collects a value. */
export function SystemFieldWidgetItem({
  properties,
}: FieldComponentProps<unknown>) {
  return (
    <p className="mt-2 text-sm text-muted-foreground">
      {properties.label} — set automatically by the system
    </p>
  );
}
