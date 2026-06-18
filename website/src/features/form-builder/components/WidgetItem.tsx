"use client";

import { Badge } from "@/components/ui/badge";
import { useGridLayoutContext } from "@/features/form-builder/components/grid/GridLayoutContext";
import type { Widget, WidgetProperties } from "@/types/template";
import { Clock } from "lucide-react";

interface WidgetItemProps {
  widget: Widget;
  properties: WidgetProperties;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  viewOnly?: boolean;
}

export function WidgetItem({
  widget,
  properties,
  isSelected,
  onSelect,
  onRemove,
  viewOnly = false,
}: WidgetItemProps) {
  const { computedLayouts, setHeight } = useGridLayoutContext();
  const layout = computedLayouts[widget.id];

  return (
    <div className="min-w-0 flex-1 bg-white rounded-md p-4">
      <div className="flex items-center gap-2">
        <p className="truncate text-sm font-medium">
          {properties.label || "(no label)"}
        </p>
        <Badge variant="secondary" className="shrink-0 text-[10px]">
          {widget.type}
        </Badge>
        {properties.required && (
          <span className="text-xs text-destructive">*</span>
        )}
      </div>
      <WidgetPreview widget={widget} properties={properties} />
    </div>
  );
}

function WidgetPreview({
  widget,
  properties,
}: {
  widget: Widget;
  properties: WidgetProperties;
}) {
  const placeholder =
    properties.placeholder ?? `Enter ${properties.label || widget.type}…`;

  if (widget.type === "session") {
    return (
      <div className="mt-2 flex items-center gap-2 rounded-md border border-dashed border-primary/40 bg-primary/5 px-2 py-3 text-xs text-muted-foreground">
        <Clock className="size-3.5 text-primary" />
        <span>Full-width, fixed session block</span>
      </div>
    );
  }

  if (widget.type === "checkbox") {
    return (
      <div className="mt-2 flex items-center gap-2">
        <div className="size-4 rounded border border-input bg-background" />
        <span className="text-xs text-muted-foreground">
          {properties.label}
        </span>
      </div>
    );
  }

  if (widget.type === "textarea") {
    return (
      <div className="mt-2 w-full rounded-md border border-input bg-muted/30 px-2 py-1 text-xs text-muted-foreground">
        <div className="h-10" />
      </div>
    );
  }

  if (widget.type === "select") {
    return (
      <div className="mt-2 flex h-7 w-full items-center justify-between rounded-md border border-input bg-muted/30 px-2 text-xs text-muted-foreground">
        <span>{properties.options?.[0] ?? "Select…"}</span>
        <span>▾</span>
      </div>
    );
  }

  return (
    <div className="mt-2 h-7 w-full rounded-md border border-input bg-muted/30 px-2 py-1 text-xs text-muted-foreground">
      {placeholder}
    </div>
  );
}
