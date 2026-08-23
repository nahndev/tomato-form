"use client";

import { BoardProvider } from "@/features/board";
import MoreSubmissionButton from "@/features/board/components/header/MoreSubmissionButton";
import SubmissionList from "@/features/board/components/submission/SubmissionList";
import type { Board } from "@/types/board";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";

export interface WorkspaceContentProps {
  board: Board | null;
}

const WorkspaceContent: React.FC<WorkspaceContentProps> = ({ board }) => {
  if (!board) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <TomatoIcon
          icon={TomatoIconKey.LayoutGrid}
          className="mb-4 size-10 text-muted-foreground/40"
        />
        <h3 className="font-semibold text-muted-foreground">
          No board selected
        </h3>
        <p className="mt-1 text-sm text-muted-foreground/70">
          Create a board first to view its submissions
        </p>
      </div>
    );
  }

  return (
    <BoardProvider board={board}>
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">{board.name}</h2>
          <MoreSubmissionButton />
        </div>
        <div className="flex-1 overflow-auto px-4 py-4">
          <SubmissionList />
        </div>
      </div>
    </BoardProvider>
  );
};

export default WorkspaceContent;
