import { Button } from "@/components/ui/button";
import { useSessionActions } from "@/features/template/hooks/actions/useSessionActions";
import { Plus } from "lucide-react";
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
        onClick={() => addSession({ id: v4(), name: "New session" })}
      >
        <Plus className="mr-1.5 size-4" />
        Add Session
      </Button>
    </div>
  );
};

export default SessionCreation;
