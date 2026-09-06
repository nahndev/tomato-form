import * as React from "react";

export interface ExpandedProps extends React.HTMLAttributes<HTMLDivElement> {
  flex?: number;
}

function Expanded({ flex = 1, style, ...props }: ExpandedProps) {
  return (
    <div
      style={{ flexGrow: flex, flexShrink: 1, flexBasis: 0, minWidth: 0, minHeight: 0, ...style }}
      {...props}
    />
  );
}

export { Expanded };
