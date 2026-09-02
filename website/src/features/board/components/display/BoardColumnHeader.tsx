"use client";

import { cn } from "@/lib/utils";
import type { BoardColumn } from "@/types/board";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import BoardLabelInput from "./BoardLabelInput";
import BoardTypeBadge from "./BoardTypeBadge";

export interface BoardColumnHeaderProps {
  column: BoardColumn;
  onChange: (column: BoardColumn) => void;
  onRemove: () => void;
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Remove column"
      className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-destructive"
    >
      <TomatoIcon icon={TomatoIconKey.Close} className="size-3.5" />
    </button>
  );
}

const BoardColumnHeader: React.FC<BoardColumnHeaderProps> = ({
  column,
  onChange,
  onRemove,
}) => {
  return (
    <div className={cn("flex flex-col gap-1 rounded-md border p-2")}>
      <div className="flex flex-row items-center gap-2">
        <BoardLabelInput
          label={column.label}
          onChange={(label) => onChange({ ...column, label })}
        />
        <BoardTypeBadge type={column.type} />
        <CloseButton onClick={onRemove}></CloseButton>
      </div>
    </div>
  );
};

export default BoardColumnHeader;
