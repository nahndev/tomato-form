"use client";

import type { Widget, WidgetProperties } from "@/types/template";
import { useHandler, useTransaction } from "@tomato/sync";
import { WidgetHandler } from "../handlers/WidgetHandler";

export interface WidgetActions {
  addWidget: (
    id: Widget["id"],
    type: Widget["type"],
    before: Widget | null,
  ) => void;
  removeWidget: (widgetId: string) => void;
  setProperty: <K extends keyof WidgetProperties>(
    widgetId: string,
    key: K,
    value: WidgetProperties[K],
  ) => void;
}

/**
 * Action-only, no exposed state - mutates the doc through `WidgetHandler`,
 * never re-renders on data change. Placement (layout/session) for a new or
 * removed widget is `LayoutHandler`'s reaction to the events these actions
 * emit, not something this hook coordinates by hand. No `useCallback` here -
 * `widgetHandler` and `transact` are already stable references, so wrapping
 * these closures again wouldn't buy any extra referential stability.
 */
export function useWidgetActions(): WidgetActions {
  const widgetHandler = useHandler(WidgetHandler);
  const transact = useTransaction();

  return {
    addWidget: (id, type, before) =>
      transact(() => widgetHandler.addWidget(id, type, before)),

    removeWidget: (widgetId) =>
      transact(() => widgetHandler.removeWidget(widgetId)),

    setProperty: <K extends keyof WidgetProperties>(
      widgetId: string,
      key: K,
      value: WidgetProperties[K],
    ) => {
      transact(() => widgetHandler.setProperty(widgetId, key, value));
    },
  };
}
