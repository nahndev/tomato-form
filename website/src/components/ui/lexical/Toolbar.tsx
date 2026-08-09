"use client";

import { Button } from "@/components/ui/button";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";
import { useEffect, useState } from "react";

/** Tracks active text formats at the current selection, to highlight toolbar buttons. */
function useActiveFormats() {
  const [editor] = useLexicalComposerContext();
  const [formats, setFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setFormats({
            bold: selection.hasFormat("bold"),
            italic: selection.hasFormat("italic"),
            underline: selection.hasFormat("underline"),
          });
        }
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  return formats;
}

export function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const { bold, italic, underline } = useActiveFormats();

  return (
    <div className="flex gap-1 border-b border-input p-1">
      <Button
        type="button"
        variant={bold ? "default" : "ghost"}
        className="size-8"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      >
        <BoldIcon className="size-4" />
      </Button>
      <Button
        type="button"
        variant={italic ? "default" : "ghost"}
        className="size-8"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      >
        <ItalicIcon className="size-4" />
      </Button>
      <Button
        type="button"
        variant={underline ? "default" : "ghost"}
        className="size-8"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
      >
        <UnderlineIcon className="size-4" />
      </Button>
    </div>
  );
}
