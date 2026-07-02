import { ScrollArea } from "@/components/ui/scroll-area";
import SessionBox from "@/features/template/components/session/SessionBox";
import SessionCreation from "@/features/template/components/session/SessionCreation";
import { useTemplateState } from "@/features/template/hooks/state/useTemplateState";

const TemplateCanvas: React.FC = () => {
  const { sessions } = useTemplateState();
  return (
    <ScrollArea className="size-full bg-slate-200 p-10 overflow-y-scroll group/template">
      <div className="flex flex-col gap-10">
        {Object.values(sessions).map((session) => (
          <SessionBox key={session.id} sessionId={session.id} />
        ))}
        <SessionCreation />
      </div>
    </ScrollArea>
  );
};

export default TemplateCanvas;
