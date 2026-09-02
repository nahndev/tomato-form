import { LayoutRect } from "./utils";

export const GridDndType = {
  WIDGET: "@grid/widget",
} as const;
export type GridDndType = (typeof GridDndType)[keyof typeof GridDndType];

export interface AbsoluteLayout extends LayoutRect {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  idx: string;
  isStatic?: boolean;
  isFullWidth?: boolean;
}
