import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jobApi } from "@/services/job.api";
import { ACTION_TYPE_SUBMISSION_CREATION } from "@/types/job";
import type { CreateJobInput, JobAction, UpdateJobInput } from "@/types/job";

const jobsKey = (boardId?: string) => ["jobs", boardId ?? "all"] as const;
const jobKey = (id: string) => ["jobs", "item", id] as const;
const jobExecutionsKey = (jobId: string) => ["jobs", "executions", jobId] as const;

export function useJobs(boardId?: string) {
  return useQuery({
    queryKey: jobsKey(boardId),
    queryFn: () => jobApi.list(boardId),
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: jobKey(id),
    queryFn: () => jobApi.get(id),
    enabled: Boolean(id),
  });
}

export function useJobExecutions(jobId: string) {
  return useQuery({
    queryKey: jobExecutionsKey(jobId),
    queryFn: () => jobApi.listExecutions(jobId),
    enabled: Boolean(jobId),
  });
}

function invalidateJobBoards(qc: ReturnType<typeof useQueryClient>, job: { actions: JobAction[] }) {
  qc.invalidateQueries({ queryKey: jobsKey() });
  const boardIds = new Set(
    job.actions
      .filter((action) => action.type === ACTION_TYPE_SUBMISSION_CREATION)
      .map((action) => action.boardId),
  );
  boardIds.forEach((boardId) => qc.invalidateQueries({ queryKey: jobsKey(boardId) }));
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateJobInput) => jobApi.create(input),
    onSuccess: (created) => invalidateJobBoards(qc, created),
  });
}

export function useUpdateJob(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateJobInput) => jobApi.update(id, input),
    onSuccess: (updated) => {
      qc.setQueryData(jobKey(id), updated);
      invalidateJobBoards(qc, updated);
    },
  });
}

export function useDeleteJob(boardId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: jobsKey(boardId) }),
  });
}
