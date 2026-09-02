import type { ColorEnum } from "@/types/template";
import type { TomatoIconKey } from "@tomato/icon";

export const DisplayType = {
  TEXT: "text",
  DATE: "date",
  NUMBER: "number",
} as const;
export type DisplayType = (typeof DisplayType)[keyof typeof DisplayType];

export interface DisplayTypeDefinition {
  type: DisplayType;
  label: string;
  icon: TomatoIconKey;
  color: ColorEnum;
}

export type DisplayTypeRegistry = Record<DisplayType, DisplayTypeDefinition>;
