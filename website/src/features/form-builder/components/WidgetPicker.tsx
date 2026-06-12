"use client";

import { Type, AlignLeft, Hash, Calendar, List, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WidgetType } from "@/types/template";

interface WidgetDef {
  type: WidgetType;
  label: string;
  icon: React.ElementType;
  description: string;
}

const WIDGET_DEFS: WidgetDef[] = [
  { type: "text", label: "Text", icon: Type, description: "Single-line text" },
  { type: "textarea", label: "Textarea", icon: AlignLeft, description: "Multi-line text" },
  { type: "number", label: "Number", icon: Hash, description: "Numeric input" },
  { type: "date", label: "Date", icon: Calendar, description: "Date picker" },
  { type: "select", label: "Select", icon: List, description: "Dropdown select" },
  { type: "checkbox", label: "Checkbox", icon: CheckSquare, description: "Boolean toggle" },
];

interface WidgetPickerProps {
  onAdd: (type: WidgetType) => void;
}

export function WidgetPicker({ onAdd }: WidgetPickerProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Widgets
      </p>
      {WIDGET_DEFS.map((def) => {
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
