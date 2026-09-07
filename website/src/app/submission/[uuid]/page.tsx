"use client";

import {
  SubmissionButtonActionProvider,
  SubmissionCanvas,
  SubmissionHeader,
  SubmissionProvider,
  useSubmission,
} from "@/features/submission";
import { TemplateSnapshotStateProvider } from "@/features/submission/components/provider/TemplateSnapshotStateProvider";
import { useTemplate } from "@/features/template";
import { DragDropProvider } from "@dnd-kit/react";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
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
        <TomatoIcon
          icon={TomatoIconKey.Loader}
          className="size-6 animate-spin text-muted-foreground"
        />
      </div>
    );
  }

  if (isError || !submission) notFound();
  if (isTemplateError || !template) notFound();

  return (
    <DragDropProvider>
      <TemplateSnapshotStateProvider template={template}>
        <SubmissionProvider submission={submission}>
          <SubmissionButtonActionProvider>
            <div className="h-screen grid grid-rows-[auto_1fr] overflow-hidden">
              <SubmissionHeader />
              <SubmissionCanvas />
            </div>
          </SubmissionButtonActionProvider>
        </SubmissionProvider>
      </TemplateSnapshotStateProvider>
    </DragDropProvider>
  );
}
