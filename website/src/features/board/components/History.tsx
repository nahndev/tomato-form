import { History as HistoryIcon } from "lucide-react";

const History: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-16 text-center">
      <HistoryIcon className="mb-4 size-10 text-muted-foreground/40" />
      <h3 className="font-semibold text-muted-foreground">No history yet</h3>
      <p className="mt-1 text-sm text-muted-foreground/70">
        Activity on this board will be tracked here
      </p>
    </div>
  );
};

export default History;
