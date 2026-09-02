import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { resourceApi } from "@/services/document.api";
import type { ResourceType } from "@/types/document";

function resourcesKey(parentId?: string | null) {
  return ["resources", parentId ?? "root"] as const;
}

export function useResources(parentId?: string | null, type?: ResourceType) {
  return useQuery({
    queryKey: [...resourcesKey(parentId), type ?? "all"],
    queryFn: () => resourceApi.list(parentId, type),
  });
}

export function useCreateFolder(parentId?: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => resourceApi.createFolder(name, parentId),
    onSuccess: () => qc.invalidateQueries({ queryKey: resourcesKey(parentId) }),
  });
}

export function useUploadDocument(parentId?: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => resourceApi.upload(file, parentId),
    onSuccess: () => qc.invalidateQueries({ queryKey: resourcesKey(parentId) }),
  });
}

export function useMoveResource(parentId?: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, destinationId }: { id: string; destinationId: string | null }) =>
      resourceApi.move(id, destinationId),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: resourcesKey(parentId) });
      qc.invalidateQueries({ queryKey: resourcesKey(variables.destinationId) });
    },
  });
}

export function useDeleteDocument(parentId?: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resourceApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: resourcesKey(parentId) }),
  });
}
