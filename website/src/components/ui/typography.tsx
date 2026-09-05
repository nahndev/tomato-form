import * as React from "react";

export interface TypographyProps extends React.HTMLAttributes<HTMLSpanElement> {}

function Typography({ className, ...props }: TypographyProps) {
  return <span className={className} {...props} />;
}

export { Typography };
