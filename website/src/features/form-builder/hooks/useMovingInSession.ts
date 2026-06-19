"use client";

import { useDndMonitor } from "@dnd-kit/core";
import { useState } from "react";
import { AbsoluteLayout } from "../libs/grid-layout/types";

export function useMovingInSession(
  sessionId: string,
  initial: AbsoluteLayout | null,
): AbsoluteLayout | null {
  const [moving, setMoving] = useState<AbsoluteLayout | null>(null);

  useDndMonitor({
    onDragMove: ({ active, over }) => {
      // console.log("over", over);
      if (!active || !initial || over?.id !== sessionId) {
        setMoving(null);
        return null;
      }

      const activeRect = active.rect.current.translated;
      if (!activeRect) {
        setMoving(null);
        return null;
      }

      setMoving({
        ...initial,
        left: activeRect.left - over.rect.left,
        top: activeRect.top - over.rect.top,
      });
    },
    onDragEnd: ({ over }) => {
      setMoving(null);
    },
  });

  return moving;
}
