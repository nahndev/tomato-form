"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import SubmissionSessionBox from "@/features/submission/components/session/SubmissionSessionBox";
import { useVisibleSessions } from "@/features/submission/hooks/state/useVisibleSessions";

/**
 * Shows every session whose visibility condition currently evaluates true,
 * in declared order - unlike the prior wizard view, which rendered only the
 * current session and hid the rest.
 */
const SubmissionCanvas: React.FC = () => {
  const sessionList = useVisibleSessions();

  return (
    <ScrollArea className="size-full bg-slate-200 p-10 overflow-y-scroll">
      <div className="flex flex-col gap-4">
        {sessionList.map((session) => (
          <SubmissionSessionBox key={session.id} sessionId={session.id} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default SubmissionCanvas;
