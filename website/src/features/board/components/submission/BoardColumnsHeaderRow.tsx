import { Row } from "@/components/layouts";
import { Typography } from "@/components/ui/typography";
import { getColumnSizeStyle } from "@/features/board/utils/boardColumnWidgets";
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
      <Row className="flex items-center gap-2">
        {columns.map((column) => (
          <div key={column.id} style={getColumnSizeStyle(column.size)}>
            <Typography>{column.label}</Typography>
          </div>
        ))}
      </Row>
      <div className="w-6 shrink-0" />
    </div>
  );
};

export default BoardColumnsHeaderRow;
