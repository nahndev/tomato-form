"use client";

import { useDndMonitor, useDraggable } from "@dnd-kit/core";
import { useTemplateLayoutContext } from "../components/grid/TemplateLayoutContext";
import { AbsoluteLayout } from "../libs/grid-layout/types";

export function useWidgetDraggable(id: string, layout: AbsoluteLayout) {
  const { setInitial, setRelative } = useTemplateLayoutContext();
  const draggable = useDraggable({ id, disabled: layout.isStatic });

  useDndMonitor({
    onDragStart({ active }) {
      if (active.id === id) {
        setInitial(layout);
        // console.log("Drag start:", active.rect.current.initial);
      }
    },
  });

  return draggable;
}
