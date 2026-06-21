import { Briefcase } from "lucide-react";

const Jobs: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-16 text-center">
      <Briefcase className="mb-4 size-10 text-muted-foreground/40" />
      <h3 className="font-semibold text-muted-foreground">No jobs yet</h3>
      <p className="mt-1 text-sm text-muted-foreground/70">
        Background jobs for this board will show up here
      </p>
    </div>
  );
};

export default Jobs;
