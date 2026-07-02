import type { WidgetProperties, WidgetType } from "@/types/template";

/**
 * Default `WidgetProperties` applied when a widget is inserted, before any
 * user edits via the properties panel.
 */
export const DEFAULT_SETTINGS: Record<WidgetType, WidgetProperties> = {
  text: { label: "Text field", placeholder: "Enter text…" },
  "text-area": { label: "Text area field", placeholder: "Enter text…" },
  number: { label: "Number field", placeholder: "0" },
  date: { label: "Date field" },
  datetime: { label: "Date & time field" },
  time: { label: "Time field" },
  select: { label: "Select field", options: ["Option 1", "Option 2"] },
  checkbox: { label: "Checkbox field", options: ["Option 1", "Option 2"] },
  radio: { label: "Radio field", options: ["Option 1", "Option 2"] },
  label: { label: "Label", content: "Enter content…" },
  signature: { label: "Signature" },
  button: { label: "Click me" },
  "image-uploader": { label: "Image upload field" },
  "file-uploader": { label: "File upload field" },
  break: { label: "Break" },
  session: { label: "Session" },
};
