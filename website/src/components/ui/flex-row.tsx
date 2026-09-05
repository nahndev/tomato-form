import { cn } from "@/lib/utils";
import * as React from "react";

export interface FlexRowProps extends React.HTMLAttributes<HTMLDivElement> {}

function FlexRow({ className, ...props }: FlexRowProps) {
  return (
    <div className={cn("flex flex-row items-center", className)} {...props} />
  );
}

export { FlexRow };
