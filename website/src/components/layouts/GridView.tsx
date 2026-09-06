import { cn } from "@/lib/utils";
import * as React from "react";
import type { EdgeInsetsValue } from "./types";
import { edgeInsetsToStyle } from "./utils/edge-insets";

export interface GridViewProps extends React.HTMLAttributes<HTMLDivElement> {
  crossAxisCount: number;
  mainAxisSpacing?: number;
  crossAxisSpacing?: number;
  childAspectRatio?: number;
  padding?: EdgeInsetsValue;
}

function GridView({
  crossAxisCount,
  mainAxisSpacing = 0,
  crossAxisSpacing = 0,
  childAspectRatio,
  padding,
  className,
  style,
  children,
  ...props
}: GridViewProps) {
  return (
    <div
      className={cn("grid overflow-y-auto", className)}
      style={{
        gridTemplateColumns: `repeat(${crossAxisCount}, minmax(0, 1fr))`,
        columnGap: crossAxisSpacing,
        rowGap: mainAxisSpacing,
        ...edgeInsetsToStyle("padding", padding),
        ...style,
      }}
      {...props}
    >
      {childAspectRatio
        ? React.Children.map(children, (child) => (
            <div style={{ aspectRatio: childAspectRatio }}>{child}</div>
          ))
        : children}
    </div>
  );
}

export { GridView };
