"use client";

import { cn } from "@/lib/utils";
import { WIDGET_LIST } from "@/features/template/components/widget/registry";
import type { WidgetType } from "@/types/template";

interface WidgetPickerProps {
  onAdd: (type: WidgetType) => void;
}

export function WidgetPicker({ onAdd }: WidgetPickerProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Widgets
      </p>
      {WIDGET_LIST.map((def) => {
        const Icon = def.icon;
        return (
          <button
            key={def.type}
            type="button"
            onClick={() => onAdd(def.type)}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
              "text-left",
            )}
          >
            <div className="flex size-7 shrink-0 items-center justify-center rounded bg-primary/10">
              <Icon className="size-3.5 text-primary" />
            </div>
            <div>
              <p className="font-medium leading-none">{def.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{def.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
