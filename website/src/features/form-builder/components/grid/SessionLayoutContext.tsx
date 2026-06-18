"use client";

import { GridLayout, Session } from "@/types/template";
import { createContext, useContext, useEffect, useMemo } from "react";
import { useMap } from "usehooks-ts";
import { useMovingInSession } from "../../hooks/useMovingInSession";
import { AbsoluteLayout } from "../../libs/grid-layout/types";
import { computeLayouts } from "../../libs/grid-layout/utils";
import { useTemplateLayoutContext } from "./TemplateLayoutContext";

interface SessionLayoutContextValue {
  sessionId: string;
  computedLayouts: Record<string, AbsoluteLayout>;
  setHeight: (id: string, height: number) => void;
  session: Session;
  containerHeight: number;
}

const SessionLayoutContext = createContext<SessionLayoutContextValue | null>(
  null,
);

export function useSessionLayoutContext() {
  const ctx = useContext(SessionLayoutContext);
  if (!ctx)
    throw new Error(
      "useSessionLayoutContext must be inside SessionLayoutProvider",
    );
  return ctx;
}

interface SessionLayoutProviderProps {
  sessionId: string;
  layoutMap: Record<string, GridLayout>;
  session: Session;
  children: React.ReactNode;
}

export function SessionLayoutProvider({
  sessionId,
  layoutMap,
  session,
  children,
}: SessionLayoutProviderProps) {
  const { initial, registerComputedLayouts } = useTemplateLayoutContext();
  const moving = useMovingInSession(sessionId, initial);
  const [heightMap, heightMapActions] = useMap<string, number>();
  const isOver = moving !== null;

  const restLayouts = useMemo(
    () => computeLayouts(layoutMap, heightMap, null),
    [layoutMap, heightMap],
  );

  const computedLayouts = useMemo(() => {
    return computeLayouts(layoutMap, heightMap, moving, isOver);
  }, [moving, layoutMap, heightMap, isOver]);

  useEffect(() => {
    registerComputedLayouts(sessionId, computedLayouts);
  }, [sessionId, computedLayouts, registerComputedLayouts]);

  const restMaxBottom = useMemo(
    () =>
      Object.values(restLayouts).reduce(
        (acc, layout) => Math.max(acc, layout.top + layout.height),
        0,
      ),
    [restLayouts],
  );

  const containerHeight = useMemo(() => {
    if (!isOver || !moving) return restMaxBottom;
    const movingBottom = moving.top + moving.height;
    return Math.min(
      Math.max(restMaxBottom, movingBottom),
      restMaxBottom + moving.height,
    );
  }, [isOver, moving, restMaxBottom]);

  return (
    <SessionLayoutContext.Provider
      value={{
        sessionId,
        computedLayouts,
        setHeight: heightMapActions.set,
        session,
        containerHeight,
      }}
    >
      {children}
    </SessionLayoutContext.Provider>
  );
}
