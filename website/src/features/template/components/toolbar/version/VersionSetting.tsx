"use client";

import { Button } from "@/components/ui/button";
import {
  useTemplateId,
  useTemplateVersion,
} from "@/features/template/components/provider/TemplateProvider";
import { useTemplateState } from "@/features/template/hooks/state/useTemplateState";
import {
  usePublishTemplate,
  useResolveTemplateMigration,
} from "@/features/template/hooks/useTemplates";
import { useTemplateActions } from "@/features/template/sync/hooks/useTemplateActions";
import type { TemplateMigration } from "@/types/template-migration";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

export type VersionSettingProps = {};

const VersionSetting: React.FC<VersionSettingProps> = () => {
  const templateId = useTemplateId();
  const contextVersion = useTemplateVersion();
  const [version, setVersion] = useState(contextVersion);
  const [pendingMigration, setPendingMigration] = useState<TemplateMigration | null>(null);
  const { isPublishing } = useTemplateState();
  const { requestPublish, settlePublish } = useTemplateActions();
  const { mutateAsync: publish } = usePublishTemplate(templateId);
  const { mutateAsync: resolveMigration, isPending: isResolving } =
    useResolveTemplateMigration(templateId);

  async function handlePublish() {
    requestPublish();
    try {
      const result = await publish();
      setVersion(result.template.version);
      if (result.migration.conflicts.length > 0) {
        setPendingMigration(result.migration);
        toast.info("Published with conflicts to resolve");
      } else {
        setPendingMigration(null);
        toast.success(`Published version ${result.template.version}`);
      }
    } catch (err) {
      console.error("Failed to publish template:", err);
      toast.error("Failed to publish");
    } finally {
      settlePublish();
    }
  }

  async function handleApplyMigration() {
    if (!pendingMigration) return;
    try {
      const result = await resolveMigration({ migrationId: pendingMigration.id, input: {} });
      setVersion(result.template.version);
      setPendingMigration(null);
      toast.success(`Published version ${result.template.version}`);
    } catch (err) {
      console.error("Failed to resolve template migration:", err);
      toast.error("Failed to apply migration");
    }
  }

  return (
    <div className="flex h-full flex-col gap-3 p-2">
      <Button onClick={handlePublish} disabled={isPublishing}>
        {isPublishing ? (
          <TomatoIcon icon={TomatoIconKey.Loader} className="size-4 animate-spin" />
        ) : (
          "Publish current version"
        )}
      </Button>

      <p className="text-sm text-muted-foreground">
        Current version: {version ?? "Not published yet"}
      </p>

      {pendingMigration && (
        <div className="flex flex-col gap-2 rounded-md border p-3 text-sm">
          <p>This publish has conflicts to resolve before it takes effect.</p>
          <Button size="sm" onClick={handleApplyMigration} disabled={isResolving}>
            {isResolving ? (
              <TomatoIcon icon={TomatoIconKey.Loader} className="size-4 animate-spin" />
            ) : (
              "Apply"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default VersionSetting;
