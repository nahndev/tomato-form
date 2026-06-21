"use client";

import { Briefcase, Loader2 } from "lucide-react";
import { useState } from "react";
import { useBoardContext } from "@/features/board/components/provider/BoardProvider";
import JobCreatorDialog from "@/features/board/components/job/JobCreatorDialog";
import JobItem from "@/features/board/components/job/JobItem";
import { useJobs } from "@/hooks/useJobs";

const JobList: React.FC = () => {
  const board = useBoardContext();
  const { data: jobs = [], isLoading } = useJobs(board.id);
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <JobCreatorDialog open={open} onOpenChange={setOpen} />
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-16 text-center">
          <Briefcase className="mb-4 size-10 text-muted-foreground/40" />
          <h3 className="font-semibold text-muted-foreground">No jobs yet</h3>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Background jobs for this board will show up here
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {jobs.map((job) => (
            <JobItem key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
