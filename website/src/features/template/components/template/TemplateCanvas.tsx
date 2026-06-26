import { ScrollArea } from "@/components/ui/scroll-area";
import { useTemplateDocContext } from "@/features/template/components/provider/TemplateProvider";
import SessionBox from "@/features/template/components/session/SessionBox";
import SessionCreation from "@/features/template/components/session/SessionCreation";

const TemplateCanvas: React.FC = () => {
  const { state } = useTemplateDocContext();
  return (
    <ScrollArea className="size-full bg-slate-200 p-10 overflow-y-scroll">
      <div className="flex flex-col gap-10">
        {Object.values(state.sessions).map((session) => (
          <SessionBox key={session.id} session={session} />
        ))}
        <SessionCreation />
      </div>
    </ScrollArea>
  );
};

export default TemplateCanvas;
