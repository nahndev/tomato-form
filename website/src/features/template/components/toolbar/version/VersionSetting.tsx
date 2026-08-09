"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTemplateId } from "@/features/template/components/provider/TemplateProvider";
import { useTemplate, usePublishTemplateVersion } from "@/hooks/useTemplates";
import type { TemplateVersion } from "@/types/template";
import { Loader2 } from "lucide-react";
import * as semver from "semver";
import { toast } from "sonner";

export type VersionSettingProps = {};

const VersionSetting: React.FC<VersionSettingProps> = () => {
  const templateId = useTemplateId();
  const { data: template, isLoading, error, refetch } = useTemplate(templateId);
  const { mutateAsync: publishVersion, isPending } =
    usePublishTemplateVersion(templateId);

  const versions = [...(template?.templateVersions ?? [])].sort((a, b) =>
    semver.rcompare(a.version, b.version),
  );

  async function handlePublish() {
    try {
      const version = await publishVersion();
      toast.success(`Published version ${version.version}`);
    } catch (err) {
      console.error("Failed to publish template version:", err);
      toast.error("Failed to publish version");
    }
  }

  return (
    <div className="flex h-full flex-col gap-2 p-2">
      <Button onClick={handlePublish} disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          "Publish current version"
        )}
      </Button>

      <VersionList
        versions={versions}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
      />
    </div>
  );
};

interface VersionListProps {
  versions: TemplateVersion[];
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
}
const VersionList: React.FC<VersionListProps> = ({
  versions,
  isLoading,
  error,
  onRetry,
}) => {
  if (error && versions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
        <p>Failed to load versions.</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      </div>
    );
  }

  if (isLoading && versions.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
