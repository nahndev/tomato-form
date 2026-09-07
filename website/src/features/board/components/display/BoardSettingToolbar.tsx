"use client";

import { Button } from "@/components/ui/button";
import { JsonColumn } from "@/features/board/utils/column";
import type { BoardColumnDraft } from "@/types/board";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import clsx from "clsx";

export interface BoardSettingToolbarProps {
  onAddColumn: (column: BoardColumnDraft) => void;
}

const BoardSettingToolbar: React.FC<BoardSettingToolbarProps> = ({
  onAddColumn,
}) => {
  function handleAddColumn() {
    onAddColumn(JsonColumn.create());
  }

  return (
    <div
      className={clsx(
        "flex flex-row items-center justify-start",
        "w-full h-10",
      )}
    >
      <div className="w-40" />
      <div className="flex flex-1 justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddColumn}
          className="border-dashed"
        >
          <TomatoIcon icon={TomatoIconKey.Plus} className="mr-1.5 size-4" />
          Add column
        </Button>
      </div>
    </div>
  );
};

export default BoardSettingToolbar;
