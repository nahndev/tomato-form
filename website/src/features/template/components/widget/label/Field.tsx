"use client";

import type { FieldComponentProps } from "@/features/template/components/widget/types";

/** Read-only static content. Never collects a value. */
export function Field({ properties }: FieldComponentProps<unknown>) {
  return (
    <p className="mt-2 text-sm text-foreground whitespace-pre-wrap">
      {properties.content || "Enter content…"}
    </p>
  );
}
