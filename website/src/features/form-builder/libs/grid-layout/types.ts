import { GridLayout, Session } from "@/types/template";

export interface AbsoluteLayout {
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
