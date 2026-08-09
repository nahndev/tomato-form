import { Template } from "@/types/template";

export function useCurrentVersion(template: Template) {
  const versionEntries = template.templateVersions ?? [];
  return versionEntries[versionEntries.length - 1]?.version;
}
