import { WidgetType } from "@/types/template";
import type { GridLayout } from "@/types/template";

/**
 * Default grid placement applied when a widget is inserted. `idx` is
 * intentionally omitted - it is always computed at insertion time from
 * sibling widgets via `generateKeyBetween` (see
 * `TemplateBuilder.handleAddWidget`).
 */
export const DEFAULT_LAYOUTS: Record<WidgetType, Omit<GridLayout, "idx">> = {
  [WidgetType.TEXT]: { column: 0, span: 2 },
  [WidgetType.TEXT_AREA]: { column: 0, span: 4, isFullWidth: true },
  [WidgetType.NUMBER]: { column: 0, span: 2 },
  [WidgetType.DATE]: { column: 0, span: 2 },
  [WidgetType.DATETIME]: { column: 0, span: 2 },
  [WidgetType.TIME]: { column: 0, span: 2 },
  [WidgetType.SELECT]: { column: 0, span: 2 },
  [WidgetType.CHECKBOX]: { column: 0, span: 2 },
  [WidgetType.RADIO]: { column: 0, span: 2 },
  [WidgetType.LABEL]: { column: 0, span: 4, isFullWidth: true },
  [WidgetType.SIGNATURE]: { column: 0, span: 4, isFullWidth: true },
  [WidgetType.BUTTON]: { column: 0, span: 2 },
  [WidgetType.IMAGE_UPLOADER]: { column: 0, span: 2 },
  [WidgetType.FILE_UPLOADER]: { column: 0, span: 2 },
  [WidgetType.BREAK]: {
    column: 0,
    span: 4,
    isFullWidth: true,
    isStatic: true,
  },
  [WidgetType.SESSION]: {
    column: 0,
    span: 4,
    isFullWidth: true,
    isStatic: false,
  },
  [WidgetType.USERS]: { column: 0, span: 2 },
};
