"use client";

import {
  type GridLayout,
  type Template,
  type Widget,
  type WidgetProperties,
} from "@/types/template";
import { useCallback, useEffect, useRef, useState } from "react";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import { GRID_COLUMNS } from "../components/grid/GridLayoutContext";

function clampLayout(column: number, span: number): { column: number; span: number } {
  const clampedColumn = Math.max(0, Math.min(column, GRID_COLUMNS - 1));
  const clampedSpan = Math.max(1, Math.min(span, GRID_COLUMNS - clampedColumn));
  return { column: clampedColumn, span: clampedSpan };
}

const YJS_SERVER_URL = process.env.NEXT_PUBLIC_YJS_URL ?? "ws://localhost:3028";

export interface TemplateYjsState {
  name: string;
  widgets: Record<string, Widget>;
  layouts: Record<string, GridLayout>;
  properties: Record<string, WidgetProperties>;
}

export interface UseTemplateYjsReturn {
  state: TemplateYjsState;
  isConnected: boolean;
  setName: (name: string) => void;
  addWidget: (widget: Widget, layout: GridLayout, props: WidgetProperties) => void;
  removeWidget: (widgetId: string) => void;
  updateLayout: (widgetId: string, layout: Partial<GridLayout>) => void;
  updateProperties: (
    widgetId: string,
    props: Partial<WidgetProperties>,
  ) => void;
  reorderWidgets: (orderedIds: string[]) => void;
}

export function useTemplateYjs(
  templateId: string,
  initialData?: Template,
): UseTemplateYjsReturn {
  const docRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [state, setState] = useState<TemplateYjsState>({
    name: initialData?.name ?? "",
    widgets: initialData?.widgets ?? {},
    layouts: initialData?.layouts ?? {},
    properties: initialData?.properties ?? {},
  });

  const getDoc = () => docRef.current!;

  const readState = (doc: Y.Doc): TemplateYjsState => ({
    name: doc.getText("name").toString(),
    widgets: Object.fromEntries(doc.getMap<Widget>("widgets").entries()),
    layouts: Object.fromEntries(doc.getMap<GridLayout>("layouts").entries()),
    properties: Object.fromEntries(
      doc.getMap<WidgetProperties>("properties").entries(),
    ),
  });

  useEffect(() => {
    const doc = new Y.Doc();
    docRef.current = doc;

    const provider = new WebsocketProvider(
      YJS_SERVER_URL,
      `template-${templateId}`,
      doc,
    );
    providerRef.current = provider;

    provider.on("status", ({ status }: { status: string }) => {
      setIsConnected(status === "connected");
    });

    const onDocUpdate = () => setState(readState(doc));
    doc.on("update", onDocUpdate);

    return () => {
      doc.off("update", onDocUpdate);
      provider.destroy();
      doc.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  const setName = useCallback((name: string) => {
    const doc = getDoc();
    const yName = doc.getText("name");
    doc.transact(() => {
      yName.delete(0, yName.length);
      yName.insert(0, name);
    });
  }, []);

  const addWidget = useCallback(
    (widget: Widget, layout: GridLayout, props: WidgetProperties) => {
      const doc = getDoc();
      const { column, span } = clampLayout(layout.column, layout.span);
      doc.transact(() => {
        doc.getMap<Widget>("widgets").set(widget.id, widget);
        doc.getMap<GridLayout>("layouts").set(widget.id, { ...layout, column, span });
        doc.getMap<WidgetProperties>("properties").set(widget.id, props);
      });
    },
    [],
  );

  const removeWidget = useCallback((widgetId: string) => {
    const doc = getDoc();
    doc.transact(() => {
      doc.getMap("widgets").delete(widgetId);
      doc.getMap("layouts").delete(widgetId);
      doc.getMap("properties").delete(widgetId);
    });
  }, []);

  const updateLayout = useCallback(
    (widgetId: string, patch: Partial<GridLayout>) => {
      const yGridLayouts = getDoc().getMap<GridLayout>("layouts");
      const current = yGridLayouts.get(widgetId) ?? { column: 0, span: 4, idx: "a" };
      const merged = { ...current, ...patch };
      const { column, span } = clampLayout(merged.column, merged.span);
      yGridLayouts.set(widgetId, { ...merged, column, span });
    },
    [],
  );

  const updateProperties = useCallback(
    (widgetId: string, patch: Partial<WidgetProperties>) => {
      const yProps = getDoc().getMap<WidgetProperties>("properties");
      const current = yProps.get(widgetId) ?? { label: "" };
      yProps.set(widgetId, { ...current, ...patch });
    },
    [],
  );

  const reorderWidgets = useCallback((orderedIds: string[]) => {
    const doc = getDoc();
    const yGridLayouts = doc.getMap<GridLayout>("layouts");
    doc.transact(() => {
      orderedIds.forEach((id, index) => {
        const current = yGridLayouts.get(id) ?? { column: 0, span: 4, idx: index };
        yGridLayouts.set(id, { ...current, idx: "a" });
      });
    });
  }, []);

  return {
    state,
    isConnected,
    setName,
    addWidget,
    removeWidget,
    updateLayout,
    updateProperties,
    reorderWidgets,
  };
}
