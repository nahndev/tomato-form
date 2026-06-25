"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useTemplateDocContext,
  useTemplateMode,
} from "@/features/template/components/provider/TemplateProvider";
import TemplateCanvas from "@/features/template/components/template/TemplateCanvas";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { WidgetPicker } from "../WidgetPicker";
import { WidgetPropertiesPanel } from "../WidgetPropertiesPanel";

interface TemplateBuilderProps {}

export function TemplateBuilder({}: TemplateBuilderProps) {
  const { state, addSession, updateProperties } = useTemplateDocContext();
  const { viewOnly } = useTemplateMode();

  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

  const handleAddSession = useCallback(() => {
    const sessionNumber = Object.keys(state.sessions).length + 1;
    addSession({ id: uuidv4(), name: `Section ${sessionNumber}` });
  }, [addSession, state.sessions]);

  const selectedWidget = selectedWidgetId
    ? state.widgets[selectedWidgetId]
    : null;
  const selectedProps = selectedWidgetId
    ? state.properties[selectedWidgetId]
    : null;

  return (
    <div className="size-full overflow-hidden flex flex-row">
      {!viewOnly && (
        <div className="w-64 flex flex-col gap-4 border-r p-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={handleAddSession}
          >
            <Plus className="mr-1.5 size-4" />
            Add Session
          </Button>
          <ScrollArea className="flex-1">
            <WidgetPicker />
          </ScrollArea>
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
