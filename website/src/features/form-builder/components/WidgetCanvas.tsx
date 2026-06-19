"use client";

import type {
  GridLayout,
  Session,
  SessionLayout,
  Widget,
  WidgetProperties,
} from "@/types/template";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { LayoutTemplate } from "lucide-react";
import { GRID_COLUMNS } from "../libs/grid-layout/constants";
import type { SessionGroup } from "../libs/grid-layout/types";
import { TemplateLayout } from "./grid/TemplateLayout";
import { WidgetItem } from "./WidgetItem";

const UNASSIGNED_SESSION: Session = { id: "unassigned", name: "Ungrouped" };
const FALLBACK_LAYOUT: GridLayout = {
  column: 0,
  span: GRID_COLUMNS,
  idx: "unassigned",
  isFullWidth: true,
};

function buildSessionGroups(
  widgets: Record<string, Widget>,
  sessions: Record<string, Session>,
  layout: Record<string, SessionLayout>,
): SessionGroup[] {
  const groups: SessionGroup[] = Object.entries(layout).map(
    ([sessionId, sessionLayout]) => ({
      sessionId,
      session: sessions[sessionId] ?? UNASSIGNED_SESSION,
      layouts: sessionLayout.layouts,
    }),
  );

  const assignedIds = new Set(groups.flatMap((g) => Object.keys(g.layouts)));
  const orphanIds = Object.keys(widgets).filter((id) => !assignedIds.has(id));
  if (orphanIds.length > 0) {
    groups.push({
      sessionId: UNASSIGNED_SESSION.id,
      session: UNASSIGNED_SESSION,
      layouts: Object.fromEntries(orphanIds.map((id) => [id, FALLBACK_LAYOUT])),
    });
  }
  return groups;
}

interface WidgetCanvasProps {
  widgets: Record<string, Widget>;
  properties: Record<string, WidgetProperties>;
  sessions: Record<string, Session>;
  layout: Record<string, SessionLayout>;
  selectedWidgetId: string | null;
  onSelectWidget: (id: string) => void;
  onRemoveWidget: (id: string) => void;
  onMoveWidget: (
    widgetId: string,
    sessionId: string,
    column: number,
    idx: string,
  ) => void;
  viewOnly?: boolean;
}

export function WidgetCanvas({
  widgets,
  properties,
  sessions,
  layout,
  selectedWidgetId,
  onSelectWidget,
  onRemoveWidget,
  onMoveWidget,
  viewOnly = false,
}: WidgetCanvasProps) {
  const sensors = useSensors(useSensor(PointerSensor));

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

  const sessionGroups = buildSessionGroups(widgets, sessions, layout);

  return (
    <DndContext sensors={sensors}>
      <TemplateLayout
        widgets={widgets}
        sessionGroups={sessionGroups}
        onMoveWidget={onMoveWidget}
        renderWidget={(id) => (
          <WidgetItem
            widget={widgets[id]}
            properties={properties[id] ?? { label: "" }}
            isSelected={selectedWidgetId === id}
            onSelect={() => onSelectWidget(id)}
            onRemove={() => onRemoveWidget(id)}
            viewOnly={viewOnly}
          />
        )}
      />
    </DndContext>
  );
}
