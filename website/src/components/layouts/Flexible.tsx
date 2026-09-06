import * as React from "react";

export interface FlexibleProps extends React.HTMLAttributes<HTMLDivElement> {
  flex?: number;
  fit?: "loose" | "tight";
}

function Flexible({ flex = 1, fit = "loose", style, ...props }: FlexibleProps) {
  return (
    <div
      style={{
        flexGrow: fit === "tight" ? flex : 0,
        flexShrink: 1,
        flexBasis: fit === "tight" ? 0 : "auto",
        ...style,
      }}
      {...props}
    />
  );
}

export { Flexible };
