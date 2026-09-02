import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentApi } from "@/services/document.api";

const DOCUMENTS_KEY = ["documents"] as const;

export function useDocuments() {
  return useQuery({
    queryKey: DOCUMENTS_KEY,
    queryFn: documentApi.list,
  });
}

export function useUploadDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => documentApi.upload(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: DOCUMENTS_KEY }),
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: DOCUMENTS_KEY }),
  });
}
