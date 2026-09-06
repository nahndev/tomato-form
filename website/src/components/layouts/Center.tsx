import { cn } from "@/lib/utils";
import * as React from "react";

export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  widthFactor?: number;
  heightFactor?: number;
}

function Center({ widthFactor, heightFactor, className, style, ...props }: CenterProps) {
  return (
    <div
      className={cn("flex h-full w-full items-center justify-center", className)}
      style={{
        width: widthFactor !== undefined ? `${widthFactor * 100}%` : undefined,
        height: heightFactor !== undefined ? `${heightFactor * 100}%` : undefined,
        ...style,
      }}
      {...props}
    />
  );
}

export { Center };
