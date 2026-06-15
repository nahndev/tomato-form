"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Widget, WidgetProperties } from "@/types/template";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical, Trash2 } from "lucide-react";

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
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: widget.id, disabled: viewOnly });

  return (
    <div
      ref={setNodeRef}
      style={{
        position: "relative",
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        opacity: isDragging ? 0.75 : undefined,
      }}
      className={cn(
        "group rounded-lg border bg-card p-3 transition-colors",
        isSelected && "border-primary ring-1 ring-primary",
        isDragging && "shadow-lg",
        !viewOnly && "cursor-pointer hover:border-primary/50",
      )}
      onClick={viewOnly ? undefined : onSelect}
    >
      <div className="flex items-start gap-2">
        {!viewOnly && (
          <button
            type="button"
            className="mt-0.5 shrink-0 cursor-grab text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="size-4" />
          </button>
        )}
        <div className="min-w-0 flex-1">
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
        {!viewOnly && (
          <button
            type="button"
            className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <Trash2 className="size-3.5" />
          </button>
        )}
      </div>
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
