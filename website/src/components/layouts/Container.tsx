import { cn } from "@/lib/utils";
import * as React from "react";
import type { Alignment, BoxConstraints, BoxDecoration, EdgeInsetsValue } from "./types";
import { ALIGNMENT_TO_FLEX } from "./utils/alignment";
import { edgeInsetsToStyle } from "./utils/edge-insets";

export interface ContainerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  padding?: EdgeInsetsValue;
  margin?: EdgeInsetsValue;
  color?: string;
  decoration?: BoxDecoration;
  width?: number | string;
  height?: number | string;
  alignment?: Alignment;
  constraints?: BoxConstraints;
}

function Container({
  padding,
  margin,
  color,
  decoration,
  width,
  height,
  alignment,
  constraints,
  className,
  style,
  ...props
}: ContainerProps) {
  const align = alignment ? ALIGNMENT_TO_FLEX[alignment] : undefined;

  return (
    <div
      className={cn(alignment && "flex", className)}
      style={{
        ...edgeInsetsToStyle("padding", padding),
        ...edgeInsetsToStyle("margin", margin),
        backgroundColor: color ?? decoration?.color,
        borderRadius: decoration?.borderRadius,
        border: decoration?.border,
        boxShadow: decoration?.boxShadow,
        width,
        height,
        minWidth: constraints?.minWidth,
        maxWidth: constraints?.maxWidth,
        minHeight: constraints?.minHeight,
        maxHeight: constraints?.maxHeight,
        justifyContent: align?.justifyContent,
        alignItems: align?.alignItems,
        ...style,
      }}
      {...props}
    />
  );
}

export { Container };
