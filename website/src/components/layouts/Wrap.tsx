import { cn } from "@/lib/utils";
import * as React from "react";
import type { MainAxisAlignment } from "./types";
import { mainAxisAlignmentToClass } from "./utils/axis";

export interface WrapProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column";
  alignment?: MainAxisAlignment;
  spacing?: number;
  runSpacing?: number;
}

function Wrap({
  direction = "row",
  alignment = "start",
  spacing = 0,
  runSpacing = 0,
  className,
  style,
  ...props
}: WrapProps) {
  const isRow = direction === "row";

  return (
    <div
      className={cn(
        "flex flex-wrap",
        isRow ? "flex-row" : "flex-col",
        mainAxisAlignmentToClass(alignment),
        className,
      )}
      style={{
        columnGap: isRow ? spacing : runSpacing,
        rowGap: isRow ? runSpacing : spacing,
        ...style,
      }}
      {...props}
    />
  );
}

export { Wrap };
