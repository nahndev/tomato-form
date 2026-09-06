import { cn } from "@/lib/utils";
import * as React from "react";
import type { Alignment } from "./types";
import { ALIGNMENT_TO_FLEX } from "./utils/alignment";

export interface AlignProps extends React.HTMLAttributes<HTMLDivElement> {
  alignment?: Alignment;
  widthFactor?: number;
  heightFactor?: number;
}

function Align({
  alignment = "center",
  widthFactor,
  heightFactor,
  className,
  style,
  ...props
}: AlignProps) {
  const { justifyContent, alignItems } = ALIGNMENT_TO_FLEX[alignment];

  return (
    <div
      className={cn("flex h-full w-full", className)}
      style={{
        justifyContent,
        alignItems,
        width: widthFactor !== undefined ? `${widthFactor * 100}%` : undefined,
        height: heightFactor !== undefined ? `${heightFactor * 100}%` : undefined,
        ...style,
      }}
      {...props}
    />
  );
}

export { Align };
