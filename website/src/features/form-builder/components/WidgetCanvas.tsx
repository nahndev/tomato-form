"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { LayoutTemplate } from "lucide-react";
import { WidgetItem } from "./WidgetItem";
import type { Widget, Layout, WidgetProperties } from "@/types/template";

interface WidgetCanvasProps {
  widgets: Record<string, Widget>;
  layouts: Record<string, Layout>;
  properties: Record<string, WidgetProperties>;
  selectedWidgetId: string | null;
  onSelectWidget: (id: string) => void;
  onRemoveWidget: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
  viewOnly?: boolean;
}

function sortedWidgetIds(
  widgets: Record<string, Widget>,
  layouts: Record<string, Layout>,
): string[] {
  return Object.keys(widgets).sort(
    (a, b) => (layouts[a]?.y ?? 0) - (layouts[b]?.y ?? 0),
  );
}

export function WidgetCanvas({
  widgets,
  layouts,
  properties,
  selectedWidgetId,
  onSelectWidget,
  onRemoveWidget,
  onReorder,
  viewOnly = false,
}: WidgetCanvasProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const orderedIds = sortedWidgetIds(widgets, layouts);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedIds.indexOf(active.id as string);
    const newIndex = orderedIds.indexOf(over.id as string);
    const reordered = arrayMove(orderedIds, oldIndex, newIndex);
    onReorder(reordered);
  }

  if (orderedIds.length === 0) {
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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={orderedIds}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {orderedIds.map((id) => (
            <WidgetItem
              key={id}
              widget={widgets[id]}
              properties={properties[id] ?? { label: "" }}
              isSelected={selectedWidgetId === id}
              onSelect={() => onSelectWidget(id)}
              onRemove={() => onRemoveWidget(id)}
              viewOnly={viewOnly}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
