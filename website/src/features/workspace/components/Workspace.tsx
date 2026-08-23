"use client";

import { useBoards } from "@/features/board";
import WorkspaceBoardList from "@/features/workspace/components/WorkspaceBoardList";
import WorkspaceContent from "@/features/workspace/components/WorkspaceContent";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { useEffect, useState } from "react";

const Workspace: React.FC = () => {
  const { data: boards = [], isLoading, isError } = useBoards();
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedBoardId && boards.length > 0) {
      setSelectedBoardId(boards[0].id);
    }
  }, [boards, selectedBoardId]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <TomatoIcon
          icon={TomatoIconKey.Loader}
          className="size-6 animate-spin text-muted-foreground"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center">
        <p className="font-semibold text-destructive">
          Failed to load boards
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  const selectedBoard =
    boards.find((board) => board.id === selectedBoardId) ?? null;

  return (
    <div className="flex h-screen overflow-hidden">
      <WorkspaceBoardList
        boards={boards}
        selectedBoardId={selectedBoardId}
        onSelect={setSelectedBoardId}
      />
      <main className="flex-1 overflow-hidden">
        <WorkspaceContent key={selectedBoard?.id} board={selectedBoard} />
      </main>
    </div>
  );
};

export default Workspace;
