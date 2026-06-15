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
import { useMemo } from "react";
import { GridContainer } from "./grid/GridContainer";
import { GridItem } from "./grid/GridItem";
import {
  COLUMN_WIDTH,
  GRID_COLUMNS,
  GridLayoutProvider,
} from "./grid/GridLayoutContext";
import { WidgetItem } from "./WidgetItem";

interface WidgetCanvasProps {
  widgets: Record<string, Widget>;
  layouts: Record<string, Layout>;
  properties: Record<string, WidgetProperties>;
  selectedWidgetId: string | null;
  onSelectWidget: (id: string) => void;
  onRemoveWidget: (id: string) => void;
  onMoveWidget: (id: string, x: number) => void;
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

  const gridItems = useMemo(
    () =>
      Object.entries(layouts).map(([id, layout]) => ({
        id,
        x: layout.x,
        width: layout.width,
        idx: layout.idx,
      })),
    [layouts],
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, delta } = event;
    const id = active.id as string;
    const current = layouts[id];
    if (!current) return;

    const newX = Math.round(current.x + delta.x / COLUMN_WIDTH);
    const clamped = Math.max(0, Math.min(newX, GRID_COLUMNS - current.width));
    if (clamped !== current.x) {
      onMoveWidget(id, clamped);
    }
  }

  const widgetIds = Object.keys(widgets);

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
      <GridLayoutProvider items={gridItems}>
        <GridContainer>
          {widgetIds.map((id) => (
            <GridItem key={id} id={id}>
              <WidgetItem
                widget={widgets[id]}
                properties={properties[id] ?? { label: "" }}
                isSelected={selectedWidgetId === id}
                onSelect={() => onSelectWidget(id)}
                onRemove={() => onRemoveWidget(id)}
                viewOnly={viewOnly}
              />
            </GridItem>
          ))}
        </GridContainer>
      </GridLayoutProvider>
    </DndContext>
  );
}
