import BoardTypeBadge from "@/features/board/components/column/BoardTypeBadge";
import type { BoardColumn } from "@/types/board";

export interface BoardColumnsHeaderRowProps {
  columns: BoardColumn[];
}

const BoardColumnsHeaderRow: React.FC<BoardColumnsHeaderRowProps> = ({
  columns,
}) => {
  if (columns.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-2 pb-2">
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        {columns.map((column) =>
          column.type === null ? null : (
            <div
              key={column.id}
              className="flex min-w-[150px] flex-col gap-1"
            >
              {column.label && (
                <span className="truncate text-xs font-semibold">
                  {column.label}
                </span>
              )}
              <BoardTypeBadge type={column.type} />
            </div>
          ),
        )}
      </div>
      <div className="w-6 shrink-0" />
    </div>
  );
};

export default BoardColumnsHeaderRow;
