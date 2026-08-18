import { submissionApi } from "@/services/submission.api";
import { useQuery } from "@tanstack/react-query";

const submissionKey = (id: string) => ["submissions", "item", id] as const;

export function useSubmission(id: string) {
  return useQuery({
    queryKey: submissionKey(id),
    queryFn: () => submissionApi.get(id),
    enabled: Boolean(id),
  });
}
