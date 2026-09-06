import { cn } from "@/lib/utils";
import * as React from "react";
import type { EdgeInsetsValue } from "./types";
import { edgeInsetsToStyle } from "./utils/edge-insets";

export interface ListViewProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  scrollDirection?: "vertical" | "horizontal";
  padding?: EdgeInsetsValue;
  physics?: "auto" | "never" | "always";
  itemCount?: number;
  itemBuilder?: (index: number) => React.ReactNode;
  children?: React.ReactNode;
}

function ListView({
  scrollDirection = "vertical",
  padding,
  physics = "auto",
  itemCount,
  itemBuilder,
  children,
  className,
  style,
  ...props
}: ListViewProps) {
  const items =
    itemBuilder && itemCount !== undefined
      ? Array.from({ length: itemCount }, (_, index) => (
          <React.Fragment key={index}>{itemBuilder(index)}</React.Fragment>
        ))
      : children;

  const scrollClass =
    physics === "never"
      ? "overflow-hidden"
      : scrollDirection === "horizontal"
        ? "overflow-x-auto overflow-y-hidden"
        : "overflow-y-auto overflow-x-hidden";

  return (
    <div
      className={cn(
        "flex",
        scrollDirection === "horizontal" ? "flex-row" : "flex-col",
        scrollClass,
        className,
      )}
      style={{ ...edgeInsetsToStyle("padding", padding), ...style }}
      {...props}
    >
      {items}
    </div>
  );
}

export { ListView };
