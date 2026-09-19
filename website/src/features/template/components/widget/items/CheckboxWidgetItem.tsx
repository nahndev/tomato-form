"use client";

import type { FieldComponentProps } from "@/types/widget";

/** A multi-select list of checkboxes. Value is the array of selected options. */
export function CheckboxWidgetItem({
  widget,
  value,
  onChange,
}: FieldComponentProps<string[]>) {
  const options = [...(widget.options ?? [])].sort((a, b) =>
    a.index < b.index ? -1 : 1,
  );
  const selected = value ?? [];

  function toggle(key: string) {
    const next = selected.includes(key)
      ? selected.filter((k) => k !== key)
      : [...selected, key];
    onChange?.(next);
  }

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      {options.length === 0 && (
        <span className="text-xs text-muted-foreground">
          No options configured
        </span>
      )}
      {options.map((option, idx) => (
        <div key={option.key} className="flex items-center gap-2 text-sm">
          <input
            id={idx === 0 ? widget.id : undefined}
            type="checkbox"
            checked={selected.includes(option.key)}
            onChange={() => toggle(option.key)}
            className="size-4 rounded border-input accent-primary"
          />
          {option.value}
        </div>
      ))}
    </div>
  );
}
