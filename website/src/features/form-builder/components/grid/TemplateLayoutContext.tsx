"use client";

import { Widget } from "@/types/template";
import { useDndMonitor } from "@dnd-kit/core";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AbsoluteLayout } from "../../libs/grid-layout/types";

interface TemplateLayoutContextValue {
  initial: AbsoluteLayout | null;
  setInitial: (layout: AbsoluteLayout | null) => void;
  registerComputedLayouts: (
    sessionId: string,
    layouts: Record<string, AbsoluteLayout>,
  ) => void;
  moving: AbsoluteLayout | null;
  heights: Record<string, number>;
  setHeight: (id: string, height: number) => void;
  setClone: (clone: HTMLDivElement | null) => void;
  setRelative: (rect: { left: number; top: number } | null) => void;
  relative: { left: number; top: number } | null;
  delta: { x: number; y: number } | null;
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
  widgets: Record<string, Widget>;
  children: React.ReactNode;
  onMoveWidget: (
    widgetId: string,
    sessionId: string,
    column: number,
    idx: string,
  ) => void;
}

export function TemplateLayoutProvider({
  widgets,
  children,
  onMoveWidget,
}: TemplateLayoutProviderProps) {
  const [initial, setInitial] = useState<AbsoluteLayout | null>(null);
  const [relative, setRelative] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const [delta, setDelta] = useState<{ x: number; y: number } | null>(null);
  const [heights, setHeights] = useState<Record<string, number>>({});
  const [clone, setClone] = useState<HTMLDivElement | null>(null);

  const moving = useMemo(() => {
    if (!initial || !delta) return null;
    return {
      ...initial,
      left: initial.left + delta.x,
      top: initial.top + delta.y,
    };
  }, [initial, delta]);

  const computedLayoutsRef = useRef<
    Record<string, Record<string, AbsoluteLayout>>
  >({});

  const registerComputedLayouts = useCallback(
    (sessionId: string, layouts: Record<string, AbsoluteLayout>) => {
      computedLayoutsRef.current[sessionId] = layouts;
    },
    [],
  );

  console.log("relative", relative);

  useDndMonitor({
    onDragMove({ delta }) {
      setDelta(delta);
    },
    onDragEnd: ({ active, over }) => {
      setDelta(null);
      setInitial(null);
    },
  });

  const setHeight = useCallback(
    (id: string, height: number) => {
      setHeights((h) => ({ ...h, [id]: height }));
    },
    [setHeights],
  );

  return (
    <TemplateLayoutContext.Provider
      value={{
        initial,
        setInitial,
        registerComputedLayouts,
        moving,
        heights,
        setHeight,
        setClone,
        setRelative,
        relative,
        delta,
      }}
    >
      {children}
    </TemplateLayoutContext.Provider>
  );
}

function Ghost({ clone }: { clone: HTMLDivElement | null }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("clone changed", clone, overlayRef.current);
    if (clone && overlayRef.current) {
      overlayRef.current.innerHTML = "";
      overlayRef.current.appendChild(clone);
    }
  }, []);

  return <div ref={overlayRef}></div>;
}
