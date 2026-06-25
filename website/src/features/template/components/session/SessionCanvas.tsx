import { ContainerLayout } from "@/features/template/components/grid/ContainerLayout";
import { useSessionContext } from "@/features/template/components/provider/SessionProvider";
import { useTemplateMode } from "@/features/template/components/provider/TemplateProvider";
import { WidgetItem } from "@/features/template/components/widget/WidgetItem";

const SessionCanvas: React.FC = () => {
  const { viewOnly } = useTemplateMode();
  const { layouts, widgets, session, onMoving } = useSessionContext();
  return (
    <ContainerLayout
      layouts={layouts}
      id={session.id}
      onMoving={onMoving}
      disabled={viewOnly}
    >
      {(id) => <WidgetItem key={id} widget={widgets[id]} />}
    </ContainerLayout>
  );
};

export default SessionCanvas;
