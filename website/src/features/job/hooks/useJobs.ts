import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jobApi } from "@/services/job.api";
import type { CreateJobInput, UpdateJobInput } from "@/types/job";

const jobsKey = (boardId: string) => ["jobs", boardId] as const;
const jobKey = (id: string) => ["jobs", "item", id] as const;
const jobExecutionsKey = (jobId: string) => ["jobs", "executions", jobId] as const;

export function useJobs(boardId: string) {
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

export function useCreateJob(boardId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateJobInput) => jobApi.create(boardId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: jobsKey(boardId) }),
  });
}

export function useUpdateJob(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateJobInput) => jobApi.update(id, input),
    onSuccess: (updated) => {
      qc.setQueryData(jobKey(id), updated);
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useDeleteJob(boardId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: jobsKey(boardId) }),
  });
}
