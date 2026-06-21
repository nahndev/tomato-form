import { ContainerLayout } from "@/features/template/components/gridv2/ContainerLayout";
import { useSessionContext } from "@/features/template/components/provider/SessionProvider";
import { WidgetItem } from "@/features/template/components/WidgetItem";

export type SessionCanvasProps = {};

const SessionCanvas: React.FC<SessionCanvasProps> = () => {
  const { layouts, widgets, session, onMoving } = useSessionContext();
  return (
    <ContainerLayout layouts={layouts} id={session.id} onMoving={onMoving}>
      {(id) => <WidgetItem key={id} widget={widgets[id]} />}
    </ContainerLayout>
  );
};

export default SessionCanvas;
