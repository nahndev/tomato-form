"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import ChartSettingPopup from "@/features/board/components/display/ChartSettingPopup";
import { BOARD_VIEW_TYPE_REGISTRY } from "@/features/board/constants/view/boardViewTypes";
import { useUpdateBoard } from "@/features/board/hooks/useBoards";
import type { Board } from "@/types/board";
import { BoardViewType, type BoardView } from "@/types/board-view";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { useState } from "react";

export interface BoardViewListItemProps {
  board: Board;
  view: BoardView;
}

const BoardViewListItem: React.FC<BoardViewListItemProps> = ({ board, view }) => {
  const { mutateAsync: updateBoard, isPending } = useUpdateBoard(board.id);
  const [editOpen, setEditOpen] = useState(false);

  async function handleDelete() {
    try {
      await updateBoard({ views: board.views.filter((v) => v.id !== view.id) });
      toast.success("View removed");
    } catch (err) {
      console.error("Failed to remove view:", err);
      toast.error("Failed to remove view");
    }
  }

  const descriptor = BOARD_VIEW_TYPE_REGISTRY[view.type];

  return (
    <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
      <TomatoIcon icon={descriptor.icon} className="size-4 shrink-0 text-muted-foreground" />
      <span className="flex-1 truncate text-sm">{view.name}</span>

      {view.type === BoardViewType.CHART && (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Edit ${view.name}`}
            onClick={() => setEditOpen(true)}
          >
            <TomatoIcon icon={TomatoIconKey.Pencil} className="size-3.5" />
          </Button>
          <ChartSettingPopup
            board={board}
            view={view}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
        </>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={isPending}
            aria-label={`Remove ${view.name}`}
          >
            <TomatoIcon icon={TomatoIconKey.Trash} className="size-3.5" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this view?</AlertDialogTitle>
            <AlertDialogDescription>
              This deletes &quot;{view.name}&quot;. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Remove view</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BoardViewListItem;
