"use client";

import { Button } from "@/components/ui/button";
import type { BoardColumn } from "@/types/board";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import clsx from "clsx";
import { v4 } from "uuid";

export interface BoardSettingToolbarProps {
  columns: BoardColumn[];
  onAddColumn: (column: BoardColumn) => void;
  onRemoveColumn: (columnId: string) => void;
}

const BoardSettingToolbar: React.FC<BoardSettingToolbarProps> = ({
  columns,
  onAddColumn,
  onRemoveColumn,
}) => {
  function handleAddColumn() {
    onAddColumn({ id: v4(), type: null, size: null, label: null, items: [] });
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
          <TomatoIcon icon={TomatoIconKey.Trash} className="mr-1.5 size-4" />
          Remove column
        </Button>
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
