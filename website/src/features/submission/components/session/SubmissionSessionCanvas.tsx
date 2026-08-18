"use client";

import { ContainerLayout } from "@/components/ui/grid";
import { SubmissionWidgetItem } from "@/features/submission/components/widget/SubmissionWidgetItem";
import { useSessionId } from "@/features/template/components/session/SessionProvider";
import { useSessionState } from "@/features/template/hooks/state/useSessionState";

const noop = () => {};

/** Read-only grid: same session layout as the template, never draggable/resizable. */
const SubmissionSessionCanvas: React.FC = () => {
  const sessionId = useSessionId();
  const { layouts, widgets } = useSessionState();

  return (
    <ContainerLayout
      layouts={layouts}
      id={sessionId}
      onMoving={noop}
      onResize={noop}
      disabled
    >
      {(id: string) => <SubmissionWidgetItem key={id} widget={widgets[id]} />}
    </ContainerLayout>
  );
};

export default SubmissionSessionCanvas;
