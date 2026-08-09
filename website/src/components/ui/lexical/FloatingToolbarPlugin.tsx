import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
} from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { PropsWithChildren, useEffect, useState } from "react";

const TOOLBAR_GAP = 8;

interface FloatingPosition {
  top: number;
  left: number;
}

function getSelectionRect(): DOMRect | null {
  const domSelection = window.getSelection();
  if (!domSelection || domSelection.rangeCount === 0) return null;
  return domSelection.getRangeAt(0).getBoundingClientRect();
}

export function FloatingToolbarPlugin({ children }: PropsWithChildren) {
  const [editor] = useLexicalComposerContext();
  const [position, setPosition] = useState<FloatingPosition | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      const rect = getSelectionRect();
      if (!rect || (rect.width === 0 && rect.height === 0)) {
        setPosition(null);
        return;
      }
      setPosition({ top: rect.top - TOOLBAR_GAP, left: rect.left + rect.width / 2 });
    };

    const removeCommand = editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || selection.isCollapsed()) {
          setPosition(null);
          return false;
        }
        updatePosition();
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      removeCommand();
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [editor]);

  if (!position) {
    return null;
  }

  return (
    <div
      className="fixed z-50 -translate-x-1/2 -translate-y-full"
      style={{ top: position.top, left: position.left }}
    >
      {children}
    </div>
  );
}
