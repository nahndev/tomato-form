import * as React from "react";
import type { EdgeInsetsValue } from "./types";
import { edgeInsetsToStyle } from "./utils/edge-insets";

export interface PaddingProps extends React.HTMLAttributes<HTMLDivElement> {
  padding: EdgeInsetsValue;
}

function Padding({ padding, style, ...props }: PaddingProps) {
  return <div style={{ ...edgeInsetsToStyle("padding", padding), ...style }} {...props} />;
}

export { Padding };
