import type { CSSProperties } from "react";
import type { EdgeInsetsValue } from "../types";

interface ResolvedEdgeInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface AxisEdgeInsets {
  horizontal?: number;
  vertical?: number;
}

function isAxisEdgeInsets(value: object): value is AxisEdgeInsets {
  return "horizontal" in value || "vertical" in value;
}

export function resolveEdgeInsets(value?: EdgeInsetsValue): ResolvedEdgeInsets {
  if (value === undefined) return { top: 0, right: 0, bottom: 0, left: 0 };
  if (typeof value === "number") {
    return { top: value, right: value, bottom: value, left: value };
  }
  if (isAxisEdgeInsets(value)) {
    const { horizontal = 0, vertical = 0 } = value;
    return { top: vertical, right: horizontal, bottom: vertical, left: horizontal };
  }
  const { top = 0, right = 0, bottom = 0, left = 0 } = value;
  return { top, right, bottom, left };
}

export function edgeInsetsToStyle(
  property: "padding" | "margin",
  value?: EdgeInsetsValue,
): CSSProperties {
  const { top, right, bottom, left } = resolveEdgeInsets(value);
  if (property === "padding") {
    return {
      paddingTop: top,
      paddingRight: right,
      paddingBottom: bottom,
      paddingLeft: left,
    };
  }
  return {
    marginTop: top,
    marginRight: right,
    marginBottom: bottom,
    marginLeft: left,
  };
}
