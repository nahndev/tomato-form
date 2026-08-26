import { Button } from "@/components/ui/button";
import { useSessionActions } from "@/features/template/sync/hooks/useSessionActions";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { v4 } from "uuid";

export type SessionCreationProps = {};

const SessionCreation: React.FC<SessionCreationProps> = () => {
  const { addSession } = useSessionActions();
  return (
    <div className="mx-auto">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full justify-start"
        onClick={() => addSession(v4(), { name: "New session" })}
      >
        <TomatoIcon icon={TomatoIconKey.Plus} className="mr-1.5 size-4" />
        Add Session
      </Button>
    </div>
  );
};

export default SessionCreation;
