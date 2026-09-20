"use client";

import { Button } from "@/components/ui/button";
import { useBoardContext } from "@/features/board/components/provider/BoardProvider";
import BoardColumnsHeaderRow from "@/features/board/components/submission/BoardColumnsHeaderRow";
import SubmissionItem from "@/features/board/components/submission/SubmissionItem";
import BoardViewSwitcher, {
  TABLE_VIEW_ID,
} from "@/features/board/components/submission/display/BoardViewSwitcher";
import ChartDisplay from "@/features/board/components/submission/display/ChartDisplay";
import type { Submission } from "@/types/submission";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { useState } from "react";

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
  const board = useBoardContext();
  const [activeViewId, setActiveViewId] = useState<string>(TABLE_VIEW_ID);
  const activeView = board.views.find((v) => v.id === activeViewId);

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

  return (
    <div className="flex flex-col gap-4">
      <BoardViewSwitcher
        views={board.views}
        activeViewId={activeViewId}
        onChange={setActiveViewId}
      />

      {submissions.length === 0 ? (
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
      ) : activeView ? (
        <ChartDisplay view={activeView} submissions={submissions} />
      ) : (
        <>
          <BoardColumnsHeaderRow columns={board.columns} />
          {submissions.map((submission) => (
            <SubmissionItem key={submission.id} submission={submission} />
          ))}
        </>
      )}
    </div>
  );
};

export default WorkspaceBoardContent;
