"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import SubmissionSessionBox from "@/features/submission/components/session/SubmissionSessionBox";
import { useCurrentSessionId } from "@/features/submission/hooks/state/useCurrentSessionId";
import { useVisibleSessions } from "@/features/submission/hooks/state/useVisibleSessions";

/**
 * Wizard view: only the current session is shown (defaults to the first
 * visible one), navigated via a `button` widget's `submit`/`return` actions -
 * unlike `TemplateCanvas`, which always shows every session at once for
 * editing regardless of visibility conditions.
 */
const SubmissionCanvas: React.FC = () => {
  const sessionList = useVisibleSessions();
  const currentSessionId = useCurrentSessionId();
  const currentIndex = sessionList.findIndex((s) => s.id === currentSessionId);

  return (
    <ScrollArea className="size-full bg-slate-200 p-10 overflow-y-scroll">
      <div className="flex flex-col gap-4">
        {sessionList.length > 1 && (
          <p className="text-center text-sm text-muted-foreground">
            Step {Math.max(currentIndex, 0) + 1} of {sessionList.length}
          </p>
        )}
        {currentSessionId && (
          <SubmissionSessionBox key={currentSessionId} sessionId={currentSessionId} />
        )}
      </div>
    </ScrollArea>
  );
};

export default SubmissionCanvas;
