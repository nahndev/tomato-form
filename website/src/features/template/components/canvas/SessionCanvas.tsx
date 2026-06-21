import { ContainerLayout } from "@/features/template/components/grid/ContainerLayout";
import { useSessionContext } from "@/features/template/components/provider/SessionProvider";
import { WidgetItem } from "@/features/template/components/WidgetItem";

const SessionCanvas: React.FC = () => {
  const { layouts, widgets, session, onMoving } = useSessionContext();
  return (
    <ContainerLayout layouts={layouts} id={session.id} onMoving={onMoving}>
      {(id) => <WidgetItem key={id} widget={widgets[id]} />}
    </ContainerLayout>
  );
};

export default SessionCanvas;
