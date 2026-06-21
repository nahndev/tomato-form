"use client";

import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useBoardContext } from "@/features/board/components/provider/BoardProvider";
import { useDeleteJob } from "@/hooks/useJobs";
import { Job, JobStatus } from "@/types/job";

export type JobItemProps = {
  job: Job;
};

const STATUS_VARIANT: Record<JobStatus, "secondary" | "default" | "destructive"> = {
  [JobStatus.IDLE]: "secondary",
  [JobStatus.RUNNING]: "default",
  [JobStatus.SUCCESS]: "default",
  [JobStatus.FAILED]: "destructive",
};

const JobItem: React.FC<JobItemProps> = ({ job }) => {
  const board = useBoardContext();
  const { mutateAsync: deleteJob, isPending } = useDeleteJob(board.id);

  return (
    <Link href={`/boards/${board.id}/jobs/${job.id}`}>
      <div className="flex flex-row items-center gap-3 p-2 group hover:bg-accent">
        <div className="flex items-center gap-2">
          <span className="text-base">{job.name}</span>
          <Badge variant={STATUS_VARIANT[job.status]}>{job.status}</Badge>
        </div>
        <div className="ml-2 flex-1" />
        <div className="text-sm text-muted-foreground">
          Next run:{" "}
          {job.nextRunAt ? new Date(job.nextRunAt).toLocaleString() : "—"}
        </div>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteJob(job.id);
            }}
            className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 disabled:opacity-50"
            aria-label="Delete job"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default JobItem;
