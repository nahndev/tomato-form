import * as React from "react";

export interface SizedBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  height?: number | string;
}

function SizedBox({ width, height, style, ...props }: SizedBoxProps) {
  return (
    <div
      style={{ width, height, flexShrink: 0, ...style }}
      {...props}
    />
  );
}

export { SizedBox };
