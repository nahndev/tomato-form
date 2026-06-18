"use client";

import { useDndContext } from "@dnd-kit/core";
import { useMemo } from "react";
import { AbsoluteLayout } from "../libs/grid-layout/types";

export function useMovingInSession(
  sessionId: string,
  initial: AbsoluteLayout | null,
): AbsoluteLayout | null {
  const { active, over } = useDndContext();

  return useMemo(() => {
    if (!active || !initial || over?.id !== sessionId) return null;

    const activeRect = active.rect.current.translated;
    if (!activeRect) return null;

    return {
      ...initial,
      left: activeRect.left - over.rect.left,
      top: activeRect.top - over.rect.top,
    };
  }, [active, over, sessionId, initial]);
}
