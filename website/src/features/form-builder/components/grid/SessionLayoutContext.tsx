"use client";

import { COLUMN_WIDTH } from "@/features/form-builder/libs/grid-layout/constants";
import { GridLayout, Session } from "@/types/template";
import { useDndMonitor } from "@dnd-kit/core";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
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
  setPosition: (position: Coordinates) => void;
  position: Coordinates;
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
  onMoveWidget: (widgetId: string, column: number, idx: string) => void;
}

export function SessionLayoutProvider({
  sessionId,
  layoutMap,
  session,
  children,
  onMoveWidget,
}: SessionLayoutProviderProps) {
  const [position, setPosition] = useState<Coordinates>({ x: 0, y: 0 });
  const { initial, registerComputedLayouts, moving, setHeight } =
    useTemplateLayoutContext();
  const movingInSession = useMovingInSession(sessionId, initial);

  // console.log("moving", movingInSession?.top, movingInSession?.left);
  const [heightMap, heightMapActions] = useMap<string, number>();
  const isOver = movingInSession !== null;

  const computedLayouts = useMemo(() => {
    // console.log(movingInSession, moving);
    return computeLayouts(
      layoutMap,
      heightMap,
      movingInSession,
      moving,
      isOver,
    );
  }, [movingInSession, layoutMap, heightMap, isOver, moving]);
  // console.log("computedLayouts", computedLayouts);

  useEffect(() => {
    registerComputedLayouts(sessionId, computedLayouts);
  }, [sessionId, computedLayouts, registerComputedLayouts]);

  useDndMonitor({
    onDragEnd: ({ over }) => {
      if (movingInSession) {
        const { id, idx, left } = computedLayouts[movingInSession.id];
        onMoveWidget(id, Math.floor(left / COLUMN_WIDTH), idx);
      }
    },
  });

  const containerHeight = useMemo(() => {
    // console.log("computedLayouts", computedLayouts);
    const maxBottom = Object.values(computedLayouts).reduce(
      (acc, layout) =>
        moving?.id === layout.id
          ? acc
          : Math.max(acc, layout.top + layout.height),
      0,
    );
    // console.log(maxBottom, movingInSession?.height);
    return maxBottom + (movingInSession ? movingInSession.height : 0);
  }, [computedLayouts, moving, movingInSession]);

  useEffect(() => {
    setHeight(sessionId, containerHeight);
  }, [setHeight, containerHeight]);

  return (
    <SessionLayoutContext.Provider
      value={{
        sessionId,
        computedLayouts,
        setHeight: heightMapActions.set,
        session,
        containerHeight,
        setPosition,
        position,
      }}
    >
      {children}
    </SessionLayoutContext.Provider>
  );
}
