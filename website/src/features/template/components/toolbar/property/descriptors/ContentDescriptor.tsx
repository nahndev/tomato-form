"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { WidgetPropertyFieldProps } from "@/features/template/components/toolbar/property/types";
import {
  CONTENT_EDITOR_NAMESPACE,
  CONTENT_EDITOR_THEME,
  onLexicalError,
  serializeContentState,
} from "@/features/template/components/widget/lexical/config";
import { useSyncContentState } from "@/features/template/components/widget/lexical/useSyncContentState";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";
import {
  $getSelection,
  $isRangeSelection,
  BLUR_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  type SerializedEditorState,
} from "lexical";
import { useEffect, useRef, useState } from "react";

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
        editor.getEditorState().read(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;
          setFormats({
            bold: selection.hasFormat("bold"),
            italic: selection.hasFormat("italic"),
            underline: selection.hasFormat("underline"),
          });
        });
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  return formats;
}

function ContentToolbar() {
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
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
        }
      >
        <UnderlineIcon className="size-4" />
      </Button>
    </div>
  );
}

/**
 * Commits the serialized editor state via `onChange` on blur, and also on
 * unmount so an in-progress edit isn't lost if the properties panel closes
 * without the editor ever receiving a DOM blur event. `onCommit` is read
 * through a ref so the effect (and its unmount commit) only ever registers
 * once per editor instance, regardless of the caller re-creating the
 * callback on every render.
 */
function CommitOnBlur({
  onCommit,
}: {
  onCommit: (state: SerializedEditorState) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const onCommitRef = useRef(onCommit);
  onCommitRef.current = onCommit;

  useEffect(() => {
    const commit = () => onCommitRef.current(editor.getEditorState().toJSON());
    const unregister = editor.registerCommand(
      BLUR_COMMAND,
      () => {
        commit();
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
    return () => {
      commit();
      unregister();
    };
  }, [editor]);

  return null;
}

function SyncContent({ content }: { content: SerializedEditorState | undefined }) {
  useSyncContentState(content);
  return null;
}

/** Static display text editor for the `label` widget. */
export function ContentDescriptor({ value, onChange }: WidgetPropertyFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="prop-content">Content</Label>
      <LexicalComposer
        initialConfig={{
          namespace: CONTENT_EDITOR_NAMESPACE,
          theme: CONTENT_EDITOR_THEME,
          editable: true,
          onError: onLexicalError,
          editorState: serializeContentState(value.content),
        }}
      >
        <div className="rounded-md border border-input bg-transparent shadow-sm focus-within:ring-1 focus-within:ring-ring">
          <ContentToolbar />
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  id="prop-content"
                  className="min-h-24 w-full px-3 py-2 text-sm focus-visible:outline-none"
                />
              }
              placeholder={
                <div className="pointer-events-none absolute left-3 top-2 text-sm text-muted-foreground">
                  Text shown to the person filling out the form…
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <HistoryPlugin />
        </div>
        <CommitOnBlur onCommit={onChange} />
        <SyncContent content={value.content} />
      </LexicalComposer>
    </div>
  );
}
