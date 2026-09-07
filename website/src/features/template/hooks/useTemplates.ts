import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { templateApi } from "@/services/template.api";
import { templateMigrationApi } from "@/services/template-migration.api";
import type { CreateTemplateInput, UpdateTemplateInput } from "@/types/template";
import type { ResolveTemplateMigrationInput } from "@/types/template-migration";

const TEMPLATES_KEY = ["templates"] as const;
const templateKey = (id: string) => ["templates", id] as const;

export function useTemplates() {
  return useQuery({
    queryKey: TEMPLATES_KEY,
    queryFn: templateApi.list,
  });
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: templateKey(id),
    queryFn: () => templateApi.get(id),
    enabled: Boolean(id),
  });
}

export function useCreateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTemplateInput) => templateApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: TEMPLATES_KEY }),
  });
}

export function useUpdateTemplate(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateTemplateInput) => templateApi.update(id, input),
    onSuccess: (updated) => {
      qc.setQueryData(templateKey(id), updated);
      qc.invalidateQueries({ queryKey: TEMPLATES_KEY });
    },
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => templateApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: TEMPLATES_KEY }),
  });
}

export function usePublishTemplate(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => templateApi.publish(id),
    onSuccess: (result) => {
      qc.setQueryData(templateKey(id), result.template);
      qc.invalidateQueries({ queryKey: templateKey(id) });
    },
  });
}

export function useResolveTemplateMigration(templateId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      migrationId,
      input,
    }: {
      migrationId: string;
      input: ResolveTemplateMigrationInput;
    }) => templateMigrationApi.resolve(migrationId, input),
    onSuccess: (result) => {
      qc.setQueryData(templateKey(templateId), result.template);
      qc.invalidateQueries({ queryKey: templateKey(templateId) });
    },
  });
}
