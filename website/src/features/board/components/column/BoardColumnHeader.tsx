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

/** Editable label + widget-type badge + remove control for a single column. */
const BoardColumnHeader: React.FC<BoardColumnHeaderProps> = ({
  column,
  onChange,
  onRemove,
}) => {
  return (
    <div
      className={cn(
        "flex min-w-[150px] flex-col gap-1 rounded-md border p-2",
        column.type === null && "border-dashed border-primary/50",
      )}
    >
      <BoardLabelInput
        label={column.label}
        onChange={(label) => onChange({ ...column, label })}
      />
      <div className="flex items-center justify-between gap-2">
        {column.type === null ? (
          <span className="text-xs text-muted-foreground">
            Pick a widget
          </span>
        ) : (
          <BoardTypeBadge type={column.type} />
        )}
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove column"
          className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-destructive"
        >
          <TomatoIcon icon={TomatoIconKey.Close} className="size-3.5" />
        </button>
      </div>
    </div>
  );
};

export default BoardColumnHeader;
