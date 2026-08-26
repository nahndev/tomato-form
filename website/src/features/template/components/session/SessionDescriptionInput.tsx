"use client";

import { TextEditor } from "@/components/lexical/TextEditor";
import { useSessionId } from "@/features/template/components/session/SessionProvider";
import { useSessionActions } from "@/features/template/hooks/actions/useSessionActions";
import { useSessionState } from "@/features/template/hooks/state/useSessionState";

/** Inline-editable session description, backed directly by the yjs doc. */
export function SessionDescriptionInput() {
  const sessionId = useSessionId();
  const { session } = useSessionState();
  const { updateSession } = useSessionActions();

  return (
    <TextEditor
      id="session-description"
      value={session?.description}
      onChange={(description) => updateSession(sessionId, { description })}
      placeholder="Add a description…"
      className="p-2 text-sm"
    />
  );
}
