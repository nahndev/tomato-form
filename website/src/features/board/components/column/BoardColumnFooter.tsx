import type { BoardColumn } from "@/types/board";
import BoardSizeBadge from "./BoardSizeBadge";

export interface BoardColumnFooterProps {
  column: BoardColumn;
}

const BoardColumnFooter: React.FC<BoardColumnFooterProps> = ({ column }) => {
  return <BoardSizeBadge size={column.size} />;
};

export default BoardColumnFooter;
