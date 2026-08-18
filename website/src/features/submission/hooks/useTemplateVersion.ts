import { templateVersionApi } from "@/services/template-version.api";
import { useQuery } from "@tanstack/react-query";

const templateVersionKey = (id: string) => ["template-versions", "item", id] as const;

/** Fetches the published, static `TemplateVersion` snapshot a submission fills in. */
export function useTemplateVersion(id: string) {
  return useQuery({
    queryKey: templateVersionKey(id),
    queryFn: () => templateVersionApi.get(id),
    enabled: Boolean(id),
  });
}
