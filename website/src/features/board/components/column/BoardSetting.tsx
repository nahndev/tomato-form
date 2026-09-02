"use client";

import { useBoardContext } from "@/features/board/components/provider/BoardProvider";
import BoardSettingContent from "./BoardSettingContent";

const BoardSetting: React.FC = () => {
  const board = useBoardContext();

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Link templates and add columns to show widget values on the board list.
        All widgets in a column must share the same display type.
      </p>
      <BoardSettingContent board={board} />;
    </div>
  );
};

export default BoardSetting;
