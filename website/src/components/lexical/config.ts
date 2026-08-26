import type { EditorThemeClasses, SerializedEditorState } from "lexical";

/** Shared namespace/theme so every `TextEditor` instance parses/renders
 * serialized editor state consistently, regardless of the owning feature. */
export const TEXT_EDITOR_NAMESPACE = "text-editor";

export const TEXT_EDITOR_THEME: EditorThemeClasses = {
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
  },
};

export function onTextEditorError(error: Error): void {
  console.error("Lexical editor error:", error);
}

/**
 * Serializes an editor state value into the JSON string lexical's
 * `editorState` expects, guarding against pre-migration data (this value
 * used to be a plain `string`) or other malformed shapes that would
 * otherwise make `parseEditorState` throw during render.
 */
export function serializeEditorState(
  state: SerializedEditorState | undefined,
): string | undefined {
  if (!state || typeof state !== "object" || !("root" in state)) {
    return undefined;
  }
  return JSON.stringify(state);
}
