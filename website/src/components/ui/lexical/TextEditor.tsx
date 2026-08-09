"use client";

import {
  TEXT_EDITOR_NAMESPACE,
  TEXT_EDITOR_THEME,
  onTextEditorError,
  serializeEditorState,
} from "@/components/ui/lexical/config";
import { FloatingToolbarPlugin } from "@/components/ui/lexical/FloatingToolbarPlugin";
import { Toolbar } from "@/components/ui/lexical/Toolbar";
import { useSyncEditorState } from "@/components/ui/lexical/useSyncEditorState";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import {
  BLUR_COMMAND,
  COMMAND_PRIORITY_LOW,
  type SerializedEditorState,
} from "lexical";
import { useEffect, useRef } from "react";

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
          <FloatingToolbarPlugin>
            <Toolbar />
          </FloatingToolbarPlugin>
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  id={id}
                  className={
                    className ??
                    "min-h-24 w-full px-3 py-2 text-sm focus-visible:outline-none"
                  }
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
