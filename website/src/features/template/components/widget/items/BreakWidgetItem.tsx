"use client";

import type { FieldComponentProps } from "@/types/widget";

/** A full-width divider line. Never collects a value. */
export function BreakWidgetItem(_props: FieldComponentProps<unknown>) {
  return <hr className="mt-2 border-t border-border" />;
}
