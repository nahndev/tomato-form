import { MOCK_VALUE } from "@/features/board/constants/column/mockValues";
import { DISPLAY_TYPE_REGISTRY } from "@/features/template/constants/widget/displayTypes";
import { DisplayType } from "@/types/display-type";
import { TomatoIcon } from "@tomato/icon";

export interface BoardColumnMockCellProps {
  type: DisplayType | null;
}

const BoardColumnMockCell: React.FC<BoardColumnMockCellProps> = ({ type }) => {
  if (type === null) return <div className="min-w-[150px]" />;

  const definition = DISPLAY_TYPE_REGISTRY[type];

  return (
    <div className="flex min-w-[150px] items-center gap-1.5 text-sm text-muted-foreground">
      <TomatoIcon icon={definition.icon} className="size-3.5" />
      {MOCK_VALUE[type]}
    </div>
  );
};

export default BoardColumnMockCell;
