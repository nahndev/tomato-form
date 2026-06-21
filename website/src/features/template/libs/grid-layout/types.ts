import { LayoutRect } from "@/features/template/libs/grid-layout/utils";
import { GridLayout, Session } from "@/types/template";

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

export interface SessionGroup {
  sessionId: string;
  session: Session;
  layouts: Record<string, GridLayout>;
}
