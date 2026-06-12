"use client";

import type {
  Layout,
  Template,
  Widget,
  WidgetProperties,
} from "@/types/template";
import { useCallback, useEffect, useRef, useState } from "react";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

const YJS_SERVER_URL = process.env.NEXT_PUBLIC_YJS_URL ?? "ws://localhost:3028";

export interface TemplateYjsState {
  name: string;
  widgets: Record<string, Widget>;
  layouts: Record<string, Layout>;
  properties: Record<string, WidgetProperties>;
}

export interface UseTemplateYjsReturn {
  state: TemplateYjsState;
  isConnected: boolean;
  setName: (name: string) => void;
  addWidget: (widget: Widget, layout: Layout, props: WidgetProperties) => void;
  removeWidget: (widgetId: string) => void;
  updateLayout: (widgetId: string, layout: Partial<Layout>) => void;
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
    layouts: Object.fromEntries(doc.getMap<Layout>("layouts").entries()),
    properties: Object.fromEntries(
      doc.getMap<WidgetProperties>("properties").entries(),
    ),
  });

  useEffect(() => {
    const doc = new Y.Doc();
    docRef.current = doc;

    const yName = doc.getText("name");
    const yWidgets = doc.getMap<Widget>("widgets");
    const yLayouts = doc.getMap<Layout>("layouts");
    const yProperties = doc.getMap<WidgetProperties>("properties");

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
    (widget: Widget, layout: Layout, props: WidgetProperties) => {
      const doc = getDoc();
      doc.transact(() => {
        doc.getMap<Widget>("widgets").set(widget.id, widget);
        doc.getMap<Layout>("layouts").set(widget.id, layout);
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
    (widgetId: string, patch: Partial<Layout>) => {
      const yLayouts = getDoc().getMap<Layout>("layouts");
      const current = yLayouts.get(widgetId) ?? {
        x: 0,
        y: 0,
        width: 12,
        height: 1,
      };
      yLayouts.set(widgetId, { ...current, ...patch });
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
    const yLayouts = doc.getMap<Layout>("layouts");
    doc.transact(() => {
      orderedIds.forEach((id, index) => {
        const current = yLayouts.get(id) ?? {
          x: 0,
          y: index,
          width: 12,
          height: 1,
        };
        yLayouts.set(id, { ...current, y: index });
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
