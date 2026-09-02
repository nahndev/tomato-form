import type { ColorEnum } from "@/types/template";
import { ConstType } from "@/types/utils";
import type { TomatoIconKey } from "@tomato/icon";

export const DisplayType = {
  TEXT: "text",
  DATE: "date",
  NUMBER: "number",
  UNKNOWN: "unknown",
} as const;

export type DisplayType = ConstType<typeof DisplayType>;
export interface DisplayTypeDefinition {
  type: DisplayType;
  label: string;
  icon: TomatoIconKey;
  color: ColorEnum;
}

export type DisplayTypeRegistry = Record<DisplayType, DisplayTypeDefinition>;
