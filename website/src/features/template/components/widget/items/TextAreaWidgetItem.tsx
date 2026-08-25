"use client";

import { cn } from "@/lib/utils";
import type { FieldComponentProps } from "@/types/widget";
import { useRef } from "react";

const FIELD_CLASS =
  "flex w-full resize-none overflow-hidden rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export function TextAreaWidgetItem({
  widget,
  value,
  onChange,
}: FieldComponentProps<string>) {
  const placeholder = widget.placeholder ?? "Enter text…";
  const ref = useRef<HTMLTextAreaElement>(null);

  function autoGrow(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  return (
    <textarea
      id={widget.id}
      ref={ref}
      rows={3}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => {
        autoGrow(e.target);
        onChange?.(e.target.value);
      }}
      className={cn(FIELD_CLASS)}
    />
  );
}
