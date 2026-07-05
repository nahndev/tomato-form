"use client";

import { useWidgetId } from "@/features/template/components/provider/WidgetProvider";
import { DEFAULT_SETTINGS } from "@/features/template/components/widget/config/settings";
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

  const type = widgets[id]["type"];

  return useMemo(
    () => ({
      widget: widgets[id],
      properties: { ...DEFAULT_SETTINGS[type], ...properties[id] },
      layout: layouts[id],
    }),
    [widgets, properties, layouts, id],
  );
}
