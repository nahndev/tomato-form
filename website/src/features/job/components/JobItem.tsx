"use client";

import { Badge } from "@/components/ui/badge";
import { useBoardContext } from "@/features/board/components/provider/BoardProvider";
import { useDeleteJob } from "@/features/job/hooks/useJobs";
import { Job } from "@/types/job";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export type JobItemProps = {
  job: Job;
};

const JobItem: React.FC<JobItemProps> = ({ job }) => {
  const router = useRouter();
  const board = useBoardContext();
  const { mutateAsync: deleteJob, isPending } = useDeleteJob(board.id);

  async function handleDelete() {
    try {
      await deleteJob(job.id);
      toast.success("Job deleted");
    } catch (err) {
      console.error("Failed to delete job:", err);
      toast.error("Failed to delete job");
    }
  }

  return (
    <Link
      role="button"
      tabIndex={0}
      href={`/jobs/${job.id}?boardId=${board.id}&mode=view`}
      onClick={() =>
        router.push(`/jobs/${job.id}?boardId=${board.id}&mode=view`)
      }
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/jobs/${job.id}?boardId=${board.id}&mode=view`);
        }
      }}
      className="flex flex-row items-center gap-3 p-2 group hover:bg-accent"
    >
      <div className="flex items-center gap-2">
        <span className="text-base">{job.name}</span>
        <Badge variant={job.enable ? "default" : "secondary"}>
          {job.enable ? "Enabled" : "Disabled"}
        </Badge>
      </div>
      <div className="ml-2 flex-1" />
      <div className="text-sm text-muted-foreground">{job.expression}</div>
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/jobs/${job.id}?boardId=${board.id}&mode=edit`);
          }}
          className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
          aria-label="Edit job"
        >
          <Pencil className="size-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          disabled={isPending}
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
    </Link>
  );
};

export default JobItem;
