"use client";

import {
  SubmissionButtonActionProvider,
  SubmissionCanvas,
  SubmissionHeader,
  SubmissionProvider,
  useSubmission,
} from "@/features/submission";
import { TemplateVersionStateProvider } from "@/features/submission/components/provider/TemplateVersionStateProvider";
import { useTemplateVersion } from "@/features/submission/hooks/useTemplateVersion";
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
    data: templateVersion,
    isLoading: isLoadingVersion,
    isError: isVersionError,
  } = useTemplateVersion(submission?.templateVersionId ?? "");

  if (isLoading || (submission && isLoadingVersion)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !submission) notFound();
  if (isVersionError || !templateVersion) notFound();

  return (
    <DragDropProvider>
      <TemplateVersionStateProvider templateVersion={templateVersion}>
        <SubmissionProvider submission={submission}>
          <SubmissionButtonActionProvider>
            <div className="h-screen grid grid-rows-[auto_1fr] overflow-hidden">
              <SubmissionHeader />
              <SubmissionCanvas />
            </div>
          </SubmissionButtonActionProvider>
        </SubmissionProvider>
      </TemplateVersionStateProvider>
    </DragDropProvider>
  );
}
