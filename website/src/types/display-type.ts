import type { ColorEnum } from "@/types/template";
import type { TomatoIconKey } from "@tomato/icon";

export enum DisplayType {
  TEXT = "text",
  DATE = "date",
  NUMBER = "number",
}

export interface DisplayTypeDefinition {
  type: DisplayType;
  label: string;
  icon: TomatoIconKey;
  color: ColorEnum;
}

export type DisplayTypeRegistry = Record<DisplayType, DisplayTypeDefinition>;
