"use client";

import { Button } from "@/components/ui/button";
import SubmissionItem from "@/features/board/components/submission/SubmissionItem";
import type { Submission } from "@/types/submission";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";

export interface WorkspaceBoardContentProps {
  submissions: Submission[];
  hasAnySubmissions: boolean;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

const WorkspaceBoardContent: React.FC<WorkspaceBoardContentProps> = ({
  submissions,
  hasAnySubmissions,
  isLoading,
  isError,
  onRetry,
}) => {
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="font-semibold text-destructive">
          Failed to load submissions
        </p>
        <p className="mt-1 text-sm text-muted-foreground/70">
          Please try again.
        </p>
        <Button className="mt-4" size="sm" variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      </div>
    );
  }

  if (isLoading && submissions.length === 0 && !hasAnySubmissions) {
    return (
      <div className="flex items-center justify-center py-16">
        <TomatoIcon
          icon={TomatoIconKey.Loader}
          className="size-6 animate-spin text-muted-foreground"
        />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-16 text-center">
        <TomatoIcon
          icon={TomatoIconKey.Document}
          className="mb-4 size-10 text-muted-foreground/40"
        />
        <h3 className="font-semibold text-muted-foreground">
          {hasAnySubmissions ? "No matching submissions" : "No submissions yet"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground/70">
          {hasAnySubmissions
            ? "Try a different template filter"
            : "Create a submission from one of this board's templates"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {submissions.map((submission) => (
        <SubmissionItem key={submission.id} submission={submission} />
      ))}
    </div>
  );
};

export default WorkspaceBoardContent;
