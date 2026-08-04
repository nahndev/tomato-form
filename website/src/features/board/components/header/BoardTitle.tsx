import { useBoardContext } from "@/features/board/components/provider/BoardProvider";

const BoardTitle: React.FC = () => {
  const board = useBoardContext();

  return (
    <div>
      <span className="font-medium">{board.name}</span>
      <p className="text-xs text-muted-foreground"></p>
    </div>
  );
};

export default BoardTitle;
