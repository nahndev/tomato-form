"use client";

import {
  SubmissionButtonActionProvider,
  SubmissionCanvas,
  SubmissionHeader,
  SubmissionProvider,
  useSubmission,
} from "@/features/submission";
import { useTemplate } from "@/features/template";
import { TemplateProvider } from "@/features/template/components/provider/TemplateProvider";
import { DragDropProvider } from "@dnd-kit/react";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { use } from "react";

interface PageProps {
  params: Promise<{ uuid: string }>;
}

export default function SubmissionPage({ params }: PageProps) {
  const { uuid } = use(params);

  const { data: submission, isLoading, isError } = useSubmission(uuid);
  const {
    data: template,
    isLoading: isLoadingTemplate,
    isError: isTemplateError,
  } = useTemplate(submission?.templateId ?? "");

  if (isLoading || (submission && isLoadingTemplate)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !submission) notFound();
  if (isTemplateError || !template) notFound();

  const versionEntries = template.templateVersions ?? [];
  const version = versionEntries[versionEntries.length - 1]?.version;
  if (!version) {
    return (
      <div className="flex h-screen items-center justify-center px-6 text-center text-sm text-muted-foreground">
        This template has no published version yet - it can&apos;t be filled
        in until one is published.
      </div>
    );
  }

  return (
    <DragDropProvider>
      <TemplateProvider template={template}>
        <SubmissionProvider submission={submission}>
          <SubmissionButtonActionProvider>
            <div className="h-screen grid grid-rows-[auto_1fr] overflow-hidden">
              <SubmissionHeader />
              <SubmissionCanvas />
            </div>
          </SubmissionButtonActionProvider>
        </SubmissionProvider>
      </TemplateProvider>
    </DragDropProvider>
  );
}
