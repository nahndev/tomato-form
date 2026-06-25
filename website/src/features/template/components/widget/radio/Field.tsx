"use client";

import type { FieldComponentProps } from "@/features/template/components/widget/types";

/** A single-select list of radio buttons. */
export function Field({
  widgetId,
  properties,
  mode,
  value,
  onChange,
}: FieldComponentProps<string>) {
  const options = properties.options ?? [];

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      {options.length === 0 && (
        <span className="text-xs text-muted-foreground">No options configured</span>
      )}
      {options.map((option, idx) => (
        <label key={option} className="flex items-center gap-2 text-sm">
          <input
            id={idx === 0 ? widgetId : undefined}
            type="radio"
            name={widgetId}
            checked={mode === "fill" ? value === option : false}
            disabled={mode === "preview"}
            onChange={() => onChange?.(option)}
            className="size-4 rounded-full border-input accent-primary"
          />
          {option}
        </label>
      ))}
    </div>
  );
}
