import * as React from "react";

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio: number;
}

function AspectRatio({ aspectRatio, style, ...props }: AspectRatioProps) {
  return <div style={{ aspectRatio, ...style }} {...props} />;
}

export { AspectRatio };
