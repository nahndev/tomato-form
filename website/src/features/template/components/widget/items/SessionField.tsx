"use client";

import { Clock } from "lucide-react";
import type { FieldComponentProps } from "@/features/template/components/widget/types";

/** A full-width, fixed block marking a session boundary. Never collects a value. */
export function Field(_props: FieldComponentProps<unknown>) {
  return (
    <div className="mt-2 flex items-center gap-2 rounded-md border border-dashed border-primary/40 bg-primary/5 px-2 py-3 text-xs text-muted-foreground">
      <Clock className="size-3.5 text-primary" />
      <span>Full-width, fixed session block</span>
    </div>
  );
}
