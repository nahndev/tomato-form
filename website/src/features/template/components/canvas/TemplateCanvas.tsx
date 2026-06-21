import { useTemplateContext } from "@/features/template/components/provider/TemplateProvider";
import SessionBox from "@/features/template/components/SessionBox";
import { DragDropProvider } from "@dnd-kit/react";

const TemplateCanvas: React.FC = () => {
  const { state } = useTemplateContext();
  return (
    <DragDropProvider>
      <div>
        {Object.values(state.sessions).map((session) => (
          <SessionBox key={session.id} session={session} />
        ))}
      </div>
    </DragDropProvider>
  );
};

export default TemplateCanvas;
