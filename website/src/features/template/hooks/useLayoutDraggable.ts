import {
  ClientRect,
  useDndMonitor,
  useDraggable,
  UseDraggableArguments,
} from "@dnd-kit/core";
import { useMemo, useRef, useState } from "react";

export function useLayoutDraggable(args: UseDraggableArguments) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [clientRect, setClientRect] = useState<ClientRect | null>(null);
  const [delta, setDelta] = useState<{ x: number; y: number } | null>(null);
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable(args);

  const setNodeRefCombined = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    ref.current = node;
  };

  useDndMonitor({
    onDragStart({ active }) {
      if (ref.current && active.id === args.id) {
        const clientRect = ref.current.getBoundingClientRect();
        setClientRect(clientRect);
      }
    },
    onDragMove({ delta, active }) {
      console.log("initial", active.rect.current.translated);
      setClientRect(active.rect.current.initial);
      setDelta(delta);
    },
    onDragEnd() {
      setDelta(null);
      setClientRect(null);
    },
  });

  const style = useMemo<React.CSSProperties>(() => {
    if (isDragging && clientRect && delta) {
      return {
        position: "fixed",
        left: clientRect.left + delta.x,
        top: clientRect.top + delta.y,
        zIndex: 9999,
      };
    }
    return {
      position: "absolute",
    };
  }, [isDragging, clientRect, delta]);

  return [setNodeRefCombined, { attributes, listeners, style }] as const;
}
