import { ContainerLayout } from "@/features/template/components/grid/ContainerLayout";
import { useSessionId } from "@/features/template/components/provider/SessionProvider";
import { useTemplateMode } from "@/features/template/components/provider/TemplateProvider";
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

  return (
    <ContainerLayout
      layouts={layouts}
      id={sessionId}
      onMoving={onMoving}
      disabled={mode === TemplateMode.VIEW}
    >
      {(id) => <WidgetItem key={id} widget={widgets[id]} />}
    </ContainerLayout>
  );
};

export default SessionCanvas;
