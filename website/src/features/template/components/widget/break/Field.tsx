"use client";

import type { FieldComponentProps } from "@/features/template/components/widget/types";

/** A full-width divider line. Never collects a value. */
export function Field(_props: FieldComponentProps<unknown>) {
  return <hr className="mt-2 border-t border-border" />;
}
