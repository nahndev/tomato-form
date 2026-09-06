import { cn } from "@/lib/utils";
import * as React from "react";
import { Positioned } from "./Positioned";
import type { Alignment } from "./types";
import { ALIGNMENT_TO_FLEX } from "./utils/alignment";

export interface StackProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "style"> {
  alignment?: Alignment;
  fit?: "loose" | "expand";
  clipBehavior?: "hardEdge" | "none";
}

function Stack({
  alignment = "topLeft",
  fit = "loose",
  clipBehavior = "hardEdge",
  className,
  children,
  ...props
}: StackProps) {
  const { justifyContent, alignItems } = ALIGNMENT_TO_FLEX[alignment];

  return (
    <div
      className={cn(
        "relative",
        fit === "expand" && "h-full w-full",
        clipBehavior === "hardEdge" && "overflow-hidden",
        className,
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === Positioned) {
          return child;
        }
        return (
          <div className="absolute inset-0 flex" style={{ justifyContent, alignItems }}>
            {child}
          </div>
        );
      })}
    </div>
  );
}

export { Stack };
