"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useTemplateId,
  useTemplateVersions,
} from "@/features/template/components/provider/TemplateProvider";
import { usePublishTemplateVersion } from "@/features/template/hooks/useTemplates";
import type { TemplateVersion } from "@/types/template";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import * as semver from "semver";
import { toast } from "sonner";

export type VersionSettingProps = {};

const VersionSetting: React.FC<VersionSettingProps> = () => {
  const templateId = useTemplateId();
  const templateVersions = useTemplateVersions();
  const { mutateAsync: publishVersion, isPending } =
    usePublishTemplateVersion(templateId);

  const versions = [...templateVersions].sort((a, b) =>
    semver.rcompare(a.version, b.version),
  );

  async function handlePublish() {
    try {
      await publishVersion();
      toast.success("Publish requested — the new version will appear here shortly");
    } catch (err) {
      console.error("Failed to publish template version:", err);
      toast.error("Failed to publish version");
    }
  }

  return (
    <div className="flex h-full flex-col gap-2 p-2">
      <Button onClick={handlePublish} disabled={isPending}>
        {isPending ? (
          <TomatoIcon icon={TomatoIconKey.Loader} className="size-4 animate-spin" />
        ) : (
          "Publish current version"
        )}
      </Button>

      <VersionList versions={versions} />
    </div>
  );
};

interface VersionListProps {
  versions: TemplateVersion[];
}
const VersionList: React.FC<VersionListProps> = ({ versions }) => {
  if (versions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No versions published yet.
      </p>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-1">
        {versions.map((version) => (
          <div
            key={version.id}
            className="flex items-center justify-between rounded-md px-3 py-1.5 text-sm hover:bg-muted"
          >
            <span className="font-medium">Version {version.version}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(version.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default VersionSetting;
