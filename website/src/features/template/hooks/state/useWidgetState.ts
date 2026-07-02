"use client";

import { useWidgetId } from "@/features/template/components/provider/WidgetProvider";
import { useTemplateState } from "@/features/template/hooks/state/useTemplateState";
import type { GridLayout, Widget, WidgetProperties } from "@/types/template";
import { useMemo } from "react";

export interface WidgetState {
  widget: Widget | undefined;
  properties: WidgetProperties | undefined;
  layout: GridLayout | undefined;
}

/**
 * State-only, doc-independent: derives purely from `useTemplateState()`.
 * Reads the widget id from the nearest `<WidgetProvider>`.
 */
export function useWidgetState(): WidgetState {
  const id = useWidgetId();
  const { widgets, properties, layouts } = useTemplateState();

  return useMemo(
    () => ({
      widget: widgets[id],
      properties: properties[id],
      layout: layouts[id],
    }),
    [widgets, properties, layouts, id],
  );
}
