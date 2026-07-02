"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useWidgetSelection } from "@/features/template/components/provider/TemplateProvider";
import { WIDGET_LIST } from "@/features/template/components/widget/registry";
import { WidgetDefinition } from "@/features/template/components/widget/types";
import { useWidgetActions } from "@/features/template/hooks/actions/useWidgetActions";
import { useTemplateState } from "@/features/template/hooks/state/useTemplateState";
import { cn } from "@/lib/utils";
import { useDragDropMonitor, useDraggable } from "@dnd-kit/react";
import React, { useMemo, useState } from "react";
import { v4 } from "uuid";

interface WidgetPickerProps {}

export function WidgetPicker({}: WidgetPickerProps) {
  const { widgets } = useTemplateState();
  const version = useMemo(() => Object.keys(widgets).length, [widgets]);
  return (
    <ScrollArea className="size-full">
      {WIDGET_LIST.map((def) => (
        <WidgetCreationButton key={def.type + version} def={def} />
      ))}
    </ScrollArea>
  );
}

export type WidgetCreationButtonProps = {
  def: WidgetDefinition;
};
const WidgetCreationButton: React.FC<WidgetCreationButtonProps> = ({ def }) => {
  const { selected, selectKey } = useWidgetSelection();
  const [id, setId] = useState(v4());
  const { addWidget } = useWidgetActions();
  const { ref: draggableRef, isDragging } = useDraggable({ id });

  const handleAddWidget = () => {
    addWidget(id, def.type, selected);
    selectKey(id);
  };

  useDragDropMonitor({
    onDragStart({ operation: { source } }) {
      if (source && source.id === id) {
        handleAddWidget();
      }
    },
    onDragEnd() {
      setId(v4());
    },
  });

  return (
    <button
      key={id}
      ref={draggableRef}
      onClick={handleAddWidget}
      className={cn(
        "cursor-pointer",
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
        "text-left",
      )}
    >
      <div className="flex size-7 shrink-0 items-center justify-center rounded bg-primary/10">
        <def.icon className="size-3.5 text-primary" />
      </div>
      <div>
        <p className="font-medium leading-none">{def.label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {def.description}
        </p>
      </div>
    </button>
  );
};
