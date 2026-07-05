import type { EditorThemeClasses, SerializedEditorState } from "lexical";

/** Shared between `ContentDescriptor` (editable) and `LabelField` (read-only)
 * so both parse/render the same serialized editor state consistently. */
export const CONTENT_EDITOR_NAMESPACE = "widget-content";

export const CONTENT_EDITOR_THEME: EditorThemeClasses = {
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
  },
};

export function onLexicalError(error: Error): void {
  console.error("Lexical editor error:", error);
}

/**
 * Serializes a `content` value into the JSON string lexical's `editorState`
 * expects, guarding against pre-migration data (the `content` property used
 * to be a plain `string`) or other malformed shapes that would otherwise
 * make `parseEditorState` throw during render.
 */
export function serializeContentState(
  content: SerializedEditorState | undefined,
): string | undefined {
  if (!content || typeof content !== "object" || !("root" in content)) {
    return undefined;
  }
  return JSON.stringify(content);
}
