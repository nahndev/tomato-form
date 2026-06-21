"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import TemplateCanvas from "@/features/template/components/canvas/TemplateCanvas";
import {
  useTemplateContext,
  useTemplateMode,
} from "@/features/template/components/provider/TemplateProvider";
import type { WidgetType } from "@/types/template";
import { generateKeyBetween } from "fractional-indexing";
import { Plus, Wifi, WifiOff } from "lucide-react";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { GRID_COLUMNS } from "../libs/grid-layout/constants";
import { WidgetPicker } from "./WidgetPicker";
import { WidgetPropertiesPanel } from "./WidgetPropertiesPanel";

interface TemplateBuilderProps {}

export function TemplateBuilder({}: TemplateBuilderProps) {
  const {
    state,
    isConnected,
    setName,
    addWidget,
    addSession,
    updateProperties,
  } = useTemplateContext();
  const { viewOnly } = useTemplateMode();

  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

  const handleAddSession = useCallback(() => {
    const sessionNumber = Object.keys(state.sessions).length + 1;
    addSession({ id: uuidv4(), name: `Section ${sessionNumber}` });
  }, [addSession, state.sessions]);

  const handleAddWidget = useCallback(
    (type: WidgetType) => {
      const id = uuidv4();
      // New widgets always land in the first session, appended after the
      // last widget there (idx strings sort lexicographically, so the
      // largest existing idx tells us where "last" is).
      const defaultSessionId = Object.keys(state.sessions)[0];
      const lastIdx = Object.entries(state.layouts)
        .filter(
          ([widgetId]) => state.widgetToSession[widgetId] === defaultSessionId,
        )
        .map(([, layout]) => layout.idx)
        .sort()
        .pop();
      const isSession = type === "session";
      addWidget(
        { id, type },
        {
          column: 0,
          span: isSession ? GRID_COLUMNS : 2,
          idx: generateKeyBetween(lastIdx ?? null, null),
          isStatic: false,
          isFullWidth: isSession,
        },
        {
          label: isSession
            ? "Session"
            : `${type.charAt(0).toUpperCase() + type.slice(1)} field`,
        },
      );
      setSelectedWidgetId(id);
    },
    [addWidget, state.sessions, state.layouts, state.widgetToSession],
  );

  const selectedWidget = selectedWidgetId
    ? state.widgets[selectedWidgetId]
    : null;
  const selectedProps = selectedWidgetId
    ? state.properties[selectedWidgetId]
    : null;

  return (
    <div className="flex h-full flex-col bg-gray-200">
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mb-3 w-full justify-start"
                onClick={handleAddSession}
              >
                <Plus className="mr-1.5 size-4" />
                Add Session
              </Button>
              <WidgetPicker onAdd={handleAddWidget} />
            </ScrollArea>
            <Separator orientation="vertical" />
          </>
        )}

        {/* Center: canvas */}

        <div className="mx-auto w-min h-min">
          <TemplateCanvas />
        </div>

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
