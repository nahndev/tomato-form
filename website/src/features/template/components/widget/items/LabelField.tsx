"use client";

import type { FieldComponentProps } from "@/features/template/components/widget/types";
import {
  CONTENT_EDITOR_NAMESPACE,
  CONTENT_EDITOR_THEME,
  onLexicalError,
  serializeContentState,
} from "@/features/template/components/widget/lexical/config";
import { useSyncContentState } from "@/features/template/components/widget/lexical/useSyncContentState";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import type { SerializedEditorState } from "lexical";

function SyncContent({ content }: { content: SerializedEditorState | undefined }) {
  useSyncContentState(content);
  return null;
}

/** Read-only static content. Never collects a value. */
export function LabelField({ properties }: FieldComponentProps<unknown>) {
  const initialState = serializeContentState(properties.content);

  if (!initialState) {
    return <p className="mt-2 text-sm text-muted-foreground">Enter content…</p>;
  }

  return (
    <LexicalComposer
      initialConfig={{
        namespace: CONTENT_EDITOR_NAMESPACE,
        theme: CONTENT_EDITOR_THEME,
        editable: false,
        onError: onLexicalError,
        editorState: initialState,
      }}
    >
      <RichTextPlugin
        contentEditable={<ContentEditable className="mt-2 text-sm text-foreground" />}
        placeholder={null}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <SyncContent content={properties.content} />
    </LexicalComposer>
  );
}
