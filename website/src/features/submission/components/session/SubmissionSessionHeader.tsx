"use client";

import { useSessionState } from "@/features/template/hooks/state/useSessionState";
import { TOMATO_ICON_MAP, TomatoIcon, type TomatoIconKey } from "@tomato/icon";

function isTomatoIconKey(value: string): value is TomatoIconKey {
  return value in TOMATO_ICON_MAP;
}

/** Read-only session header: icon + name only, no rename/icon-pick affordance. */
const SubmissionSessionHeader: React.FC = () => {
  const { properties } = useSessionState();
  const icon =
    properties?.icon && isTomatoIconKey(properties.icon)
      ? properties.icon
      : "clock";

  return (
    <div className="flex items-center gap-2 border-b border-slate-200 p-2">
      <TomatoIcon icon={icon} className="size-4 text-muted-foreground" />
      <p className="font-medium">{properties?.name}</p>
    </div>
  );
};

export default SubmissionSessionHeader;
