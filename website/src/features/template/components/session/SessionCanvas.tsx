import { ContainerLayout } from "@tomato/grid";
import { useTemplateMode } from "@/features/template/components/provider/TemplateBuilderProvider";
import { useSessionId } from "@/features/template/components/session/SessionProvider";
import { WidgetItem } from "@/features/template/components/widget/WidgetItem";
import { useSessionActions } from "@/features/template/hooks/actions/useSessionActions";
import { useSessionState } from "@/features/template/hooks/state/useSessionState";
import { TemplateMode } from "@/types/template";
import { useCallback } from "react";

const SessionCanvas: React.FC = () => {
  const mode = useTemplateMode();
  const sessionId = useSessionId();
  const { layouts, widgets } = useSessionState();
  const { updateLayout } = useSessionActions();

  const onMoving = useCallback(
    (id: string, column: number, idx: string) => {
      updateLayout(id, sessionId, { column, idx });
    },
    [updateLayout, sessionId],
  );

  const onResize = useCallback(
    (id: string, span: number) => {
      updateLayout(id, sessionId, { span });
    },
    [updateLayout, sessionId],
  );

  return (
    <ContainerLayout
      layouts={layouts}
      id={sessionId}
      onMoving={onMoving}
      onResize={onResize}
      disabled={mode === TemplateMode.VIEW}
    >
      {(id: string) => <WidgetItem key={id} widget={widgets[id]} />}
    </ContainerLayout>
  );
};

export default SessionCanvas;
