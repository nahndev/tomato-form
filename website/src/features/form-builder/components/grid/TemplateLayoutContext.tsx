"use client";

import { useDndMonitor } from "@dnd-kit/core";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { COLUMN_WIDTH } from "../../libs/grid-layout/constants";
import { AbsoluteLayout } from "../../libs/grid-layout/types";

interface TemplateLayoutContextValue {
  initial: AbsoluteLayout | null;
  setInitial: (layout: AbsoluteLayout | null) => void;
  registerComputedLayouts: (
    sessionId: string,
    layouts: Record<string, AbsoluteLayout>,
  ) => void;
}

const TemplateLayoutContext = createContext<TemplateLayoutContextValue | null>(
  null,
);

export function useTemplateLayoutContext() {
  const ctx = useContext(TemplateLayoutContext);
  if (!ctx)
    throw new Error(
      "useTemplateLayoutContext must be inside TemplateLayoutProvider",
    );
  return ctx;
}

interface TemplateLayoutProviderProps {
  children: React.ReactNode;
  onMoveWidget: (
    widgetId: string,
    sessionId: string,
    column: number,
    idx: string,
  ) => void;
}

export function TemplateLayoutProvider({
  children,
  onMoveWidget,
}: TemplateLayoutProviderProps) {
  const [initial, setInitial] = useState<AbsoluteLayout | null>(null);
  const computedLayoutsRef = useRef<
    Record<string, Record<string, AbsoluteLayout>>
  >({});

  const registerComputedLayouts = useCallback(
    (sessionId: string, layouts: Record<string, AbsoluteLayout>) => {
      computedLayoutsRef.current[sessionId] = layouts;
    },
    [],
  );

  useDndMonitor({
    onDragEnd({ active, over }) {
      const activeRect = active.rect.current.translated;
      if (over && activeRect) {
        const overSessionId = over.id as string;
        const newLayout =
          computedLayoutsRef.current[overSessionId]?.[active.id as string];
        if (newLayout) {
          const left = activeRect.left - over.rect.left;
          const column = Math.floor(left / COLUMN_WIDTH);
          onMoveWidget(
            active.id as string,
            overSessionId,
            column,
            newLayout.idx,
          );
        }
      }
      setInitial(null);
    },
  });

  return (
    <TemplateLayoutContext.Provider
      value={{ initial, setInitial, registerComputedLayouts }}
    >
      {children}
    </TemplateLayoutContext.Provider>
  );
}
