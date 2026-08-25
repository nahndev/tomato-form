"use client";

import { useSessionState } from "@/features/template/hooks/state/useSessionState";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";

function isTomatoIconKey(value: string): value is TomatoIconKey {
  return (Object.values(TomatoIconKey) as string[]).includes(value);
}

/** Read-only session header: icon + name only, no rename/icon-pick affordance. */
const SubmissionSessionHeader: React.FC = () => {
  const { session } = useSessionState();
  const icon =
    session?.icon && isTomatoIconKey(session.icon)
      ? session.icon
      : TomatoIconKey.Clock;

  return (
    <div className="flex items-center gap-2 border-b border-slate-200 p-2">
      <TomatoIcon icon={icon} className="size-4 text-muted-foreground" />
      <p className="font-medium">{session?.name}</p>
    </div>
  );
};

export default SubmissionSessionHeader;
