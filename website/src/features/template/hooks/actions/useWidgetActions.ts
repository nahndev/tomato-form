"use client";

import { useTemplateDoc } from "@/features/template/components/provider/TemplateDocProvider";
import { WIDGET_REGISTRY } from "@/features/template/components/widget/registry";
import { getOrCreateDefaultSessionId } from "@/features/template/hooks/internal/templateStateReader";
import { LayoutIdx } from "@/features/template/libs/grid-layout/utils";
import type { GridLayout, Widget, WidgetProperties } from "@/types/template";
import { useCallback } from "react";

export interface WidgetActions {
  addWidget: (
    id: Widget["id"],
    type: Widget["type"],
    before: Widget | null,
  ) => void;
  removeWidget: (widgetId: string) => void;
  updateProperties: (
    widgetId: string,
    patch: Partial<WidgetProperties>,
  ) => void;
}

/**
 * Action-only, no exposed state - mutates the doc, never re-renders on data
 * change. Reads current widget/layout/property values straight off their
 * Y.Maps at call time (not from React state) so merges always see the
 * latest value.
 */
export function useWidgetActions(): WidgetActions {
  const doc = useTemplateDoc();

  const addWidget = useCallback(
    (id: Widget["id"], type: Widget["type"], before: Widget | null) => {
      const def = WIDGET_REGISTRY[type];
      const layouts = doc.getMap<GridLayout>("layouts");
      const layout = {
        ...def.defaultLayout,
        idx: LayoutIdx.getInsertIdx(Object.fromEntries(layouts.entries()), before),
      };
      const beforeSessionId =
        before && doc.getMap<string>("widgetToSession").get(before.id);

      doc.transact(() => {
        const sessionId = beforeSessionId ?? getOrCreateDefaultSessionId(doc);
        doc.getMap<Widget>("widgets").set(id, { id, type });
        layouts.set(id, layout);
        doc.getMap<WidgetProperties>("properties").set(id, def.defaultSettings);
        doc.getMap<string>("widgetToSession").set(id, sessionId);
      });
    },
    [doc],
  );

  const removeWidget = useCallback(
    (widgetId: string) => {
      doc.transact(() => {
        doc.getMap("widgets").delete(widgetId);
        doc.getMap("properties").delete(widgetId);
        doc.getMap("layouts").delete(widgetId);
        doc.getMap("widgetToSession").delete(widgetId);
      });
    },
    [doc],
  );

  const updateProperties = useCallback(
    (widgetId: string, patch: Partial<WidgetProperties>) => {
      const yProps = doc.getMap<WidgetProperties>("properties");
      const current = yProps.get(widgetId) ?? { label: "" };
      yProps.set(widgetId, { ...current, ...patch });
    },
    [doc],
  );

  return { addWidget, removeWidget, updateProperties };
}
