import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ButtonIconProps extends Omit<
  React.ComponentProps<typeof Button>,
  "children"
> {
  icon: TomatoIconKey;
  className?: string;
}

function ButtonIcon({
  icon: icon,
  className: className,
  variant = "ghost",
  size = "icon",
  ...props
}: ButtonIconProps) {
  return (
    <Button variant={variant} size={size} {...props}>
      <TomatoIcon icon={icon} className={cn(className)} />
    </Button>
  );
}

export { ButtonIcon };
