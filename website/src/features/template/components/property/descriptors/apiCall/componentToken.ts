/** `{{widget.label}}` token syntax shared by `UrlEditor` and `JsonEditor`. */
const TOKEN_PATTERN = /\{\{[^{}]*\}\}/g;

/** Inserts a `{{label}}` token at `cursorPos`, returning the new text and cursor position. */
export function insertToken(
  text: string,
  cursorPos: number,
  label: string,
): { text: string; cursorPos: number } {
  const token = `{{${label}}}`;
  const nextText = text.slice(0, cursorPos) + token + text.slice(cursorPos);
  return { text: nextText, cursorPos: cursorPos + token.length };
}

/** Replaces every `{{...}}` token with a placeholder so the surrounding text can be validated on its own (a URL/JSON shape check, not a real substitution). */
export function stripTokensForValidation(text: string): string {
  return text.replace(TOKEN_PATTERN, "x");
}
