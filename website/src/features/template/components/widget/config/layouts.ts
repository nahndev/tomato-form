import type { GridLayout, WidgetType } from "@/types/template";

/**
 * Default grid placement applied when a widget is inserted. `idx` is
 * intentionally omitted - it is always computed at insertion time from
 * sibling widgets via `generateKeyBetween` (see
 * `TemplateBuilder.handleAddWidget`).
 */
export const DEFAULT_LAYOUTS: Record<WidgetType, Omit<GridLayout, "idx">> = {
  text: { column: 0, span: 2 },
  "text-area": { column: 0, span: 4, isFullWidth: true },
  number: { column: 0, span: 2 },
  date: { column: 0, span: 2 },
  datetime: { column: 0, span: 2 },
  time: { column: 0, span: 2 },
  select: { column: 0, span: 2 },
  checkbox: { column: 0, span: 2 },
  radio: { column: 0, span: 2 },
  label: { column: 0, span: 4, isFullWidth: true },
  signature: { column: 0, span: 4, isFullWidth: true },
  button: { column: 0, span: 2 },
  "image-uploader": { column: 0, span: 2 },
  "file-uploader": { column: 0, span: 2 },
  break: { column: 0, span: 4, isFullWidth: true, isStatic: true },
  session: { column: 0, span: 4, isFullWidth: true, isStatic: false },
};
