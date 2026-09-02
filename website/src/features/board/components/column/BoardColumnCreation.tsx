import type { BoardColumn } from "@/types/board";
import AddColumnButton from "./AddColumnButton";

export interface BoardColumnCreationProps {
  onAdd: (column: BoardColumn) => void;
}

const BoardColumnCreation: React.FC<BoardColumnCreationProps> = ({
  onAdd,
}) => {
  return <AddColumnButton onAdd={onAdd} />;
};

export default BoardColumnCreation;
