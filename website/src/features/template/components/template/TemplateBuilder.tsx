"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  useTemplateDocContext,
  useTemplateMode,
} from "@/features/template/components/provider/TemplateProvider";
import TemplateCanvas from "@/features/template/components/template/TemplateCanvas";
import TemplateConnection from "@/features/template/components/template/TemplateConnection";
import type { WidgetType } from "@/types/template";
import { generateKeyBetween } from "fractional-indexing";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { GRID_COLUMNS } from "../../libs/grid-layout/constants";
import { WidgetPicker } from "../WidgetPicker";
import { WidgetPropertiesPanel } from "../WidgetPropertiesPanel";

interface TemplateBuilderProps {}

export function TemplateBuilder({}: TemplateBuilderProps) {
  const {
    state,
    isConnected,
    setName,
    addWidget,
    addSession,
    updateProperties,
  } = useTemplateDocContext();
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
    <div className="size-full overflow-hidden flex flex-row">
      {!viewOnly && (
        <div>
          <TemplateConnection />
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
        </div>
      )}

      {/* Center: canvas */}
      <div className="flex-1">
        <TemplateCanvas />
      </div>

      {/* Right panel: properties */}
      {!viewOnly && (
        <ScrollArea className="w-64 shrink-0 border-l p-4">
          {selectedWidget && selectedProps ? (
            <WidgetPropertiesPanel
              widget={selectedWidget}
              properties={selectedProps}
              onUpdate={(patch) => updateProperties(selectedWidget.id, patch)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Select a widget to edit its properties
              </p>
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
}
