import { MessageSquare } from "lucide-react";

const Discussion: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-16 text-center">
      <MessageSquare className="mb-4 size-10 text-muted-foreground/40" />
      <h3 className="font-semibold text-muted-foreground">
        No discussion yet
      </h3>
      <p className="mt-1 text-sm text-muted-foreground/70">
        Start a conversation about this board
      </p>
    </div>
  );
};

export default Discussion;
