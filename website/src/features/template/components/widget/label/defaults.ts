import type { GridLayout, WidgetProperties } from "@/types/template";

export const DEFAULT_SETTINGS: WidgetProperties = {
  label: "Label",
  content: "Enter content…",
};

export const DEFAULT_LAYOUT: Omit<GridLayout, "idx"> = {
  column: 0,
  span: 4,
  isFullWidth: true,
};
