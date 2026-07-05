"use client";

import { Button } from "@/components/ui/button";
import {
  TEXT_EDITOR_NAMESPACE,
  TEXT_EDITOR_THEME,
  onTextEditorError,
  serializeEditorState,
} from "@/components/ui/lexical/config";
import { useSyncEditorState } from "@/components/ui/lexical/useSyncEditorState";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import {
  $getSelection,
  $isRangeSelection,
  BLUR_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  type SerializedEditorState,
} from "lexical";
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";
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

function Toolbar() {
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

/**
 * Commits the serialized editor state via `onCommit` on blur, and also on
 * unmount so an in-progress edit isn't lost if the owning UI closes without
 * the editor ever receiving a DOM blur event. `onCommit` is read through a
 * ref so the effect (and its unmount commit) only ever registers once per
 * editor instance, regardless of the caller re-creating the callback on
 * every render.
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

function SyncContent({ value }: { value: SerializedEditorState | undefined }) {
  useSyncEditorState(value);
  return null;
}

export interface TextEditorProps {
  /** Forwarded to the underlying `ContentEditable`, e.g. to pair with a `<Label htmlFor>`. */
  id?: string;
  value: SerializedEditorState | undefined;
  /** Omit for a read-only editor. */
  onChange?: (value: SerializedEditorState) => void;
  editable?: boolean;
  placeholder?: string;
  className?: string;
}

/** Rich-text editor built on Lexical. Supports bold/italic/underline, and can render editable (with a formatting toolbar) or read-only. */
export function TextEditor({
  id,
  value,
  onChange,
  editable = true,
  placeholder,
  className,
}: TextEditorProps) {
  return (
    <LexicalComposer
      initialConfig={{
        namespace: TEXT_EDITOR_NAMESPACE,
        theme: TEXT_EDITOR_THEME,
        editable,
        onError: onTextEditorError,
        editorState: serializeEditorState(value),
      }}
    >
      {editable ? (
        <div className="rounded-md border border-input bg-transparent shadow-sm focus-within:ring-1 focus-within:ring-ring">
          <Toolbar />
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  id={id}
                  className={className ?? "min-h-24 w-full px-3 py-2 text-sm focus-visible:outline-none"}
                />
              }
              placeholder={
                placeholder ? (
                  <div className="pointer-events-none absolute left-3 top-2 text-sm text-muted-foreground">
                    {placeholder}
                  </div>
                ) : null
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <HistoryPlugin />
        </div>
      ) : (
        <RichTextPlugin
          contentEditable={<ContentEditable className={className} />}
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
      )}
      {onChange ? <CommitOnBlur onCommit={onChange} /> : null}
      <SyncContent value={value} />
    </LexicalComposer>
  );
}
