"use client";

import type { FieldComponentProps } from "@/features/template/components/widget/types";

/** A multi-select list of checkboxes. Value is the array of selected options. */
export function CheckboxField({
  widgetId,
  properties,
  mode,
  value,
  onChange,
}: FieldComponentProps<string[]>) {
  const options = properties.options ?? [];
  const selected = value ?? [];

  function toggle(option: string) {
    const next = selected.includes(option)
      ? selected.filter((o) => o !== option)
      : [...selected, option];
    onChange?.(next);
  }

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      {options.length === 0 && (
        <span className="text-xs text-muted-foreground">No options configured</span>
      )}
      {options.map((option, idx) => (
        <label key={option} className="flex items-center gap-2 text-sm">
          <input
            id={idx === 0 ? widgetId : undefined}
            type="checkbox"
            checked={mode === "fill" ? selected.includes(option) : false}
            disabled={mode === "preview"}
            onChange={() => toggle(option)}
            className="size-4 rounded border-input accent-primary"
          />
          {option}
        </label>
      ))}
    </div>
  );
}
