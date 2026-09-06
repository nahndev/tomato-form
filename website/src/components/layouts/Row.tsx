import { cn } from "@/lib/utils";
import * as React from "react";
import type { CrossAxisAlignment, MainAxisAlignment, MainAxisSize } from "./types";
import { crossAxisAlignmentToClass, mainAxisAlignmentToClass } from "./utils/axis";

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  mainAxisAlignment?: MainAxisAlignment;
  crossAxisAlignment?: CrossAxisAlignment;
  mainAxisSize?: MainAxisSize;
  textDirection?: "ltr" | "rtl";
}

function Row({
  mainAxisAlignment = "start",
  crossAxisAlignment = "center",
  mainAxisSize = "max",
  textDirection,
  className,
  ...props
}: RowProps) {
  return (
    <div
      dir={textDirection}
      className={cn(
        "flex flex-row",
        mainAxisAlignmentToClass(mainAxisAlignment),
        crossAxisAlignmentToClass(crossAxisAlignment),
        mainAxisSize === "max" ? "w-full" : "w-fit",
        className,
      )}
      {...props}
    />
  );
}

export { Row };
