import { BackButton } from "@/components/ui/back-button";
import BoardTitle from "@/features/board/components/header/BoardTitle";
import BoardAction from "@/features/board/components/header/BoardAction";

const BoardHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-2 border-b px-4 py-2">
      <BackButton href="/boards" />
      <BoardTitle />
      <BoardAction />
    </div>
  );
};

export default BoardHeader;
