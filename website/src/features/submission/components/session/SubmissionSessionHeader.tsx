"use client";

import { ICON_REGISTRY } from "@/components/ui/icon-picker";
import { useSessionState } from "@/features/template/hooks/state/useSessionState";
import { Clock } from "lucide-react";

/** Read-only session header: icon + name only, no rename/icon-pick affordance. */
const SubmissionSessionHeader: React.FC = () => {
  const { properties } = useSessionState();
  const Icon = (properties?.icon && ICON_REGISTRY[properties.icon]) || Clock;

  return (
    <div className="flex items-center gap-2 border-b border-slate-200 p-2">
      <Icon className="size-4 text-muted-foreground" />
      <p className="font-medium">{properties?.name}</p>
    </div>
  );
};

export default SubmissionSessionHeader;
