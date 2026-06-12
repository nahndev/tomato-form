"use client";

import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Wifi, WifiOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTemplateYjs } from "../hooks/useTemplateYjs";
import { WidgetPicker } from "./WidgetPicker";
import { WidgetCanvas } from "./WidgetCanvas";
import { WidgetPropertiesPanel } from "./WidgetPropertiesPanel";
import type { Template, WidgetType } from "@/types/template";

interface FormBuilderProps {
  template: Template;
  viewOnly?: boolean;
}

export function FormBuilder({ template, viewOnly = false }: FormBuilderProps) {
  const {
    state,
    isConnected,
    setName,
    addWidget,
    removeWidget,
    updateProperties,
    reorderWidgets,
  } = useTemplateYjs(template.id, template);

  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

  const handleAddWidget = useCallback(
    (type: WidgetType) => {
      const id = uuidv4();
      const widgetCount = Object.keys(state.widgets).length;
      addWidget(
        { id, type },
        { x: 0, y: widgetCount, width: 12, height: 1 },
        { label: `${type.charAt(0).toUpperCase() + type.slice(1)} field` },
      );
      setSelectedWidgetId(id);
    },
    [addWidget, state.widgets],
  );

  const selectedWidget = selectedWidgetId ? state.widgets[selectedWidgetId] : null;
  const selectedProps = selectedWidgetId
    ? state.properties[selectedWidgetId]
    : null;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        {viewOnly ? (
          <h1 className="text-lg font-semibold">{state.name}</h1>
        ) : (
          <Input
            value={state.name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Form name…"
            className="max-w-sm border-0 bg-transparent p-0 text-lg font-semibold shadow-none focus-visible:ring-0"
          />
        )}
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          {isConnected ? (
            <span className="flex items-center gap-1 text-green-600">
              <Wifi className="size-3" />
              Live
            </span>
          ) : (
            <span className="flex items-center gap-1 text-muted-foreground/60">
              <WifiOff className="size-3" />
              Offline
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {/* Left panel: widget picker */}
        {!viewOnly && (
          <>
            <ScrollArea className="w-56 shrink-0 border-r p-3">
              <WidgetPicker onAdd={handleAddWidget} />
            </ScrollArea>
            <Separator orientation="vertical" />
          </>
        )}

        {/* Center: canvas */}
        <ScrollArea className="flex-1 p-6">
          <div className="mx-auto max-w-2xl">
            <WidgetCanvas
              widgets={state.widgets}
              layouts={state.layouts}
              properties={state.properties}
              selectedWidgetId={selectedWidgetId}
              onSelectWidget={(id) =>
                setSelectedWidgetId((prev) => (prev === id ? null : id))
              }
              onRemoveWidget={(id) => {
                removeWidget(id);
                if (selectedWidgetId === id) setSelectedWidgetId(null);
              }}
              onReorder={reorderWidgets}
              viewOnly={viewOnly}
            />
          </div>
        </ScrollArea>

        {/* Right panel: properties */}
        {!viewOnly && (
          <>
            <Separator orientation="vertical" />
            <ScrollArea className="w-64 shrink-0 border-l p-4">
              {selectedWidget && selectedProps ? (
                <WidgetPropertiesPanel
                  widget={selectedWidget}
                  properties={selectedProps}
                  onUpdate={(patch) =>
                    updateProperties(selectedWidget.id, patch)
                  }
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Select a widget to edit its properties
                  </p>
                </div>
              )}
            </ScrollArea>
          </>
        )}
      </div>
    </div>
  );
}
