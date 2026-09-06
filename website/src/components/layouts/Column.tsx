import { cn } from "@/lib/utils";
import * as React from "react";
import type { CrossAxisAlignment, MainAxisAlignment, MainAxisSize } from "./types";
import { crossAxisAlignmentToClass, mainAxisAlignmentToClass } from "./utils/axis";

export interface ColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  mainAxisAlignment?: MainAxisAlignment;
  crossAxisAlignment?: CrossAxisAlignment;
  mainAxisSize?: MainAxisSize;
}

function Column({
  mainAxisAlignment = "start",
  crossAxisAlignment = "center",
  mainAxisSize = "max",
  className,
  ...props
}: ColumnProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        mainAxisAlignmentToClass(mainAxisAlignment),
        crossAxisAlignmentToClass(crossAxisAlignment),
        mainAxisSize === "max" ? "h-full" : "h-fit",
        className,
      )}
      {...props}
    />
  );
}

export { Column };
