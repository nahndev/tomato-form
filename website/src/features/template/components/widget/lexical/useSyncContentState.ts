"use client";

import { serializeContentState } from "@/features/template/components/widget/lexical/config";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createParagraphNode, $getRoot, type SerializedEditorState } from "lexical";
import { useEffect, useRef } from "react";

/**
 * `LexicalComposer` only reads `initialConfig.editorState` on mount, so an
 * editor never reflects a `content` prop that changes later (e.g. a yjs sync
 * from another client, or after committing our own edit). This keeps the
 * editor state in lockstep with `content`, without clobbering an in-progress
 * local edit that already produced the same value.
 */
export function useSyncContentState(content: SerializedEditorState | undefined) {
  const [editor] = useLexicalComposerContext();
  const lastSeenJson = useRef(serializeContentState(content));

  useEffect(() => {
    const nextJson = serializeContentState(content);
    if (nextJson === lastSeenJson.current) return;
    lastSeenJson.current = nextJson;

    const currentJson = JSON.stringify(editor.getEditorState().toJSON());
    if (nextJson === currentJson) return;

    if (!nextJson) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        root.append($createParagraphNode());
      });
      return;
    }

    editor.setEditorState(editor.parseEditorState(nextJson));
  }, [editor, content]);
}
