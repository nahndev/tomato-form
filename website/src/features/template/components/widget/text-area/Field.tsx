"use client";

import { useRef } from "react";
import type { FieldComponentProps } from "@/features/template/components/widget/types";
import { cn } from "@/lib/utils";

const FIELD_CLASS =
  "flex w-full resize-none overflow-hidden rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export function Field({
  widgetId,
  properties,
  mode,
  value,
  onChange,
}: FieldComponentProps<string>) {
  const placeholder = properties.placeholder ?? "Enter text…";
  const ref = useRef<HTMLTextAreaElement>(null);

  if (mode === "preview") {
    return (
      <div className="mt-2 w-full rounded-md border border-input bg-muted/30 px-2 py-1.5 text-xs text-muted-foreground">
        <div className="h-14" />
      </div>
    );
  }

  function autoGrow(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  return (
    <textarea
      id={widgetId}
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
