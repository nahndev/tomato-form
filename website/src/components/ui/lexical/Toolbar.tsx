"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  type ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

const ALIGN_OPTIONS: {
  format: ElementFormatType;
  icon: typeof AlignLeftIcon;
}[] = [
  { format: "left", icon: AlignLeftIcon },
  { format: "center", icon: AlignCenterIcon },
  { format: "right", icon: AlignRightIcon },
  { format: "justify", icon: AlignJustifyIcon },
];

/** Tracks active text formats at the current selection, to highlight toolbar buttons. */
function useActiveFormats() {
  const [editor] = useLexicalComposerContext();
  const [formats, setFormats] = useState<{
    bold: boolean;
    italic: boolean;
    underline: boolean;
    align: ElementFormatType;
  }>({
    bold: false,
    italic: false,
    underline: false,
    align: "left",
  });

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const element =
            anchorNode.getKey() === "root"
              ? anchorNode
              : anchorNode.getTopLevelElementOrThrow();
          setFormats({
            bold: selection.hasFormat("bold"),
            italic: selection.hasFormat("italic"),
            underline: selection.hasFormat("underline"),
            align:
              ($isElementNode(element) && element.getFormatType()) || "left",
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
  const { bold, italic, underline, align } = useActiveFormats();

  return (
    <div className="flex items-center gap-1 p-1 text-popover-foreground">
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
      <Separator orientation="vertical" className="mx-1 h-6" />
      {ALIGN_OPTIONS.map(({ format, icon: Icon }) => (
        <Button
          key={format}
          type="button"
          variant={align === format ? "default" : "ghost"}
          className="size-8"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format)}
        >
          <Icon className="size-4" />
        </Button>
      ))}
    </div>
  );
}
