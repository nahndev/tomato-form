import { cn } from "@/lib/utils";
import type { BoardColumn } from "@/types/board";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import ColumnTypeBadge from "./ColumnTypeBadge";

export interface BoardColumnHeaderCellProps {
  column: BoardColumn;
  onRemove: () => void;
}

const BoardColumnHeaderCell: React.FC<BoardColumnHeaderCellProps> = ({
  column,
  onRemove,
}) => {
  return (
    <div
      className={cn(
        "flex min-w-[150px] items-center justify-between gap-2 rounded-md border p-2",
        column.type === null && "border-dashed border-primary/50",
      )}
    >
      {column.type === null ? (
        <span className="text-xs text-muted-foreground">Pick a widget</span>
      ) : (
        <ColumnTypeBadge type={column.type} />
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
  );
};

export default BoardColumnHeaderCell;
