import { LayoutRect } from "./utils";

export enum GridDndType {
  WIDGET = "@grid/widget",
}

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
