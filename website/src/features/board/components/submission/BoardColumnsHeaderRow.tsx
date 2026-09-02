import { DISPLAY_TYPE_REGISTRY } from "@/features/template/constants/widget/displayTypes";
import type { BoardColumn } from "@/types/board";
import { TomatoIcon } from "@tomato/icon";

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
              <span
                className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium"
                style={{
                  borderColor: DISPLAY_TYPE_REGISTRY[column.type].color,
                  color: DISPLAY_TYPE_REGISTRY[column.type].color,
                }}
              >
                <TomatoIcon
                  icon={DISPLAY_TYPE_REGISTRY[column.type].icon}
                  className="size-3.5"
                />
                {DISPLAY_TYPE_REGISTRY[column.type].label}
              </span>
            </div>
          ),
        )}
      </div>
      <div className="w-6 shrink-0" />
    </div>
  );
};

export default BoardColumnsHeaderRow;
