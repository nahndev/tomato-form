"use client";

import type { FieldComponentProps } from "@/types/widget";

/** A single-select list of radio buttons. */
export function RadioWidgetItem({
  widget,
  value,
  onChange,
}: FieldComponentProps<string>) {
  const options = [...(widget.options ?? [])].sort((a, b) =>
    a.index < b.index ? -1 : 1,
  );

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      {options.length === 0 && (
        <span className="text-xs text-muted-foreground">
          No options configured
        </span>
      )}
      {options.map((option, idx) => (
        <label key={option.key} className="flex items-center gap-2 text-sm">
          <input
            id={idx === 0 ? widget.id : undefined}
            type="radio"
            name={widget.id}
            checked={value === option.key}
            onChange={() => onChange?.(option.key)}
            className="size-4 rounded-full border-input accent-primary"
          />
          {option.value}
        </label>
      ))}
    </div>
  );
}
