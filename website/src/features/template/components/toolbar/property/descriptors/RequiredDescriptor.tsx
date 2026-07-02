"use client";

import { Label } from "@/components/ui/label";
import type { WidgetPropertyFieldProps } from "@/features/template/components/toolbar/property/types";

/** Whether the field must be filled in before submission. */
export function RequiredDescriptor({ value, onChange }: WidgetPropertyFieldProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        id="prop-required"
        type="checkbox"
        checked={Boolean(value.required)}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 rounded border-input accent-primary"
      />
      <Label htmlFor="prop-required">Required</Label>
    </div>
  );
}
