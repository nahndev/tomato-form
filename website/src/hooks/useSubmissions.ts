import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { submissionApi } from "@/services/submission.api";
import type {
  CreateSubmissionInput,
  UpdateSubmissionInput,
} from "@/types/submission";

const submissionsKey = (boardId?: string) =>
  ["submissions", boardId ?? "all"] as const;
const submissionKey = (id: string) => ["submissions", "item", id] as const;

export function useSubmissions(boardId?: string) {
  return useQuery({
    queryKey: submissionsKey(boardId),
    queryFn: () => submissionApi.list(boardId),
  });
}

export function useSubmission(id: string) {
  return useQuery({
    queryKey: submissionKey(id),
    queryFn: () => submissionApi.get(id),
    enabled: Boolean(id),
  });
}

export function useCreateSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSubmissionInput) => submissionApi.create(input),
    onSuccess: (created) =>
      qc.invalidateQueries({ queryKey: submissionsKey(created.boardId) }),
  });
}

export function useUpdateSubmission(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateSubmissionInput) =>
      submissionApi.update(id, input),
    onSuccess: (updated) => {
      qc.setQueryData(submissionKey(id), updated);
      qc.invalidateQueries({ queryKey: submissionsKey(updated.boardId) });
    },
  });
}

export function useDeleteSubmission(boardId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => submissionApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: submissionsKey(boardId) }),
  });
}
