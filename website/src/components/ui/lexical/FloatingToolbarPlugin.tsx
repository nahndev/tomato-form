import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
} from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { PropsWithChildren, useEffect, useState } from "react";

export function FloatingToolbarPlugin({ children }: PropsWithChildren) {
  const [editor] = useLexicalComposerContext();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        setVisible($isRangeSelection(selection) && !selection.isCollapsed());
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  if (!visible) {
    return null;
  }

  return <div className="floating-toolbar absolute">{children}</div>;
}
