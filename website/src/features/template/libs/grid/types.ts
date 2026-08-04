import { LayoutRect } from "@/features/template/libs/grid/utils";

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
