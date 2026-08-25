import * as semver from "semver";
import type { TemplateVersion } from "@/types/template";

export function findLatestVersion(
  versions: TemplateVersion[],
): TemplateVersion | undefined {
  return versions.reduce<TemplateVersion | undefined>(
    (max, v) => (!max || semver.gt(v.version, max.version) ? v : max),
    undefined,
  );
}
