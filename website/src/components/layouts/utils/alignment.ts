import type { CSSProperties } from "react";
import type { Alignment } from "../types";

interface FlexAlignment {
  justifyContent: CSSProperties["justifyContent"];
  alignItems: CSSProperties["alignItems"];
}

export const ALIGNMENT_TO_FLEX: Record<Alignment, FlexAlignment> = {
  topLeft: { justifyContent: "flex-start", alignItems: "flex-start" },
  topCenter: { justifyContent: "center", alignItems: "flex-start" },
  topRight: { justifyContent: "flex-end", alignItems: "flex-start" },
  centerLeft: { justifyContent: "flex-start", alignItems: "center" },
  center: { justifyContent: "center", alignItems: "center" },
  centerRight: { justifyContent: "flex-end", alignItems: "center" },
  bottomLeft: { justifyContent: "flex-start", alignItems: "flex-end" },
  bottomCenter: { justifyContent: "center", alignItems: "flex-end" },
  bottomRight: { justifyContent: "flex-end", alignItems: "flex-end" },
};
