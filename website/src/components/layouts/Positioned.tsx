import { cn } from "@/lib/utils";
import * as React from "react";

export interface PositionedProps extends React.HTMLAttributes<HTMLDivElement> {
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  width?: number | string;
  height?: number | string;
}

function Positioned({
  top,
  right,
  bottom,
  left,
  width,
  height,
  className,
  style,
  ...props
}: PositionedProps) {
  return (
    <div
      className={cn("absolute", className)}
      style={{ top, right, bottom, left, width, height, ...style }}
      {...props}
    />
  );
}

export { Positioned };
