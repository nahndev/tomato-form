"use client";

import type { Layout, Widget, WidgetProperties } from "@/types/template";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { LayoutTemplate } from "lucide-react";
import { WidgetItem } from "./WidgetItem";

const CANVAS_MIN_HEIGHT = 600;
const ITEM_HEIGHT = 100;

interface WidgetCanvasProps {
  widgets: Record<string, Widget>;
  layouts: Record<string, Layout>;
  properties: Record<string, WidgetProperties>;
  selectedWidgetId: string | null;
  onSelectWidget: (id: string) => void;
  onRemoveWidget: (id: string) => void;
  onMoveWidget: (id: string, x: number, y: number) => void;
  viewOnly?: boolean;
}

export function WidgetCanvas({
  widgets,
  layouts,
  properties,
  selectedWidgetId,
  onSelectWidget,
  onRemoveWidget,
  onMoveWidget,
  viewOnly = false,
}: WidgetCanvasProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  const widgetIds = Object.keys(widgets);
  function handleDragEnd(event: DragEndEvent) {
    const { active, delta } = event;
    const id = active.id as string;
    const current = layouts[id];
    if (!current) return;

    const newX = Math.floor(Math.max(0, current.x * 200 + delta.x) / 200);
    console.log(newX, current.x + delta.x);
    const newY = Math.floor(Math.max(0, current.y * 200 + delta.y));
    onMoveWidget(id, newX, newY);
  }

  if (widgetIds.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border p-12 text-center">
        <LayoutTemplate className="size-10 text-muted-foreground/50" />
        <div>
          <p className="font-medium text-muted-foreground">No widgets yet</p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            {viewOnly
              ? "This form has no widgets."
              : "Click a widget in the left panel to add it."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div
        className="relative HEEH w-full bg-white min-h-full"
        style={{ width: 800 }}
      >
        {widgetIds.map((id) => (
          <WidgetItem
            key={id}
            widget={widgets[id]}
            layout={layouts[id]}
            properties={properties[id] ?? { label: "" }}
            isSelected={selectedWidgetId === id}
            onSelect={() => onSelectWidget(id)}
            onRemove={() => onRemoveWidget(id)}
            viewOnly={viewOnly}
          />
        ))}
      </div>
    </DndContext>
  );
}
