import type { LucideProps } from "lucide-react";
import { TOMATO_ICON_MAP, type TomatoIconKey as IconKey } from "./icons";

export interface TomatoIconProps extends Omit<LucideProps, "ref"> {
  icon: IconKey;
}

/** Renders a supported icon by its stable key, so callers don't depend on the underlying icon library directly. */
export function TomatoIcon({ icon, ...props }: TomatoIconProps) {
  const Icon = TOMATO_ICON_MAP[icon];
  if (!Icon) {
    return <span>Icon not found</span>;
  }
  return <Icon {...props} />;
}
