"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { WorkspaceUserMenu } from "@/features/workspace/components/WorkspaceUserMenu";
import { cn } from "@/lib/utils";
import type { Board } from "@/types/board";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";

export interface WorkspaceBoardListProps {
  boards: Board[];
  selectedBoardId: string | null;
  onSelect: (id: string) => void;
}

const WorkspaceBoardList: React.FC<WorkspaceBoardListProps> = ({
  boards,
  selectedBoardId,
  onSelect,
}) => {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-background">
      <div className="px-4 py-5">
        <span className="text-sm font-semibold text-muted-foreground">
          Boards
        </span>
      </div>
      <ScrollArea className="flex-1">
        {boards.length === 0 ? (
          <p className="px-4 text-sm text-muted-foreground/70">
            No boards yet
          </p>
        ) : (
          <nav className="flex flex-col gap-1 px-3">
            {boards.map((board) => (
              <button
                key={board.id}
                type="button"
                onClick={() => onSelect(board.id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                  board.id === selectedBoardId
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <TomatoIcon
                  icon={TomatoIconKey.LayoutGrid}
                  className="size-4 shrink-0"
                />
                <span className="truncate">{board.name}</span>
              </button>
            ))}
          </nav>
        )}
      </ScrollArea>
      <WorkspaceUserMenu />
    </aside>
  );
};

export default WorkspaceBoardList;
