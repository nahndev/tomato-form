import type { GridLayout, WidgetProperties } from "@/types/template";

export const DEFAULT_SETTINGS: WidgetProperties = {
  label: "Number field",
  placeholder: "0",
};

export const DEFAULT_LAYOUT: Omit<GridLayout, "idx"> = {
  column: 0,
  span: 2,
};
