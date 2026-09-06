import { DISPLAY_VALUE_REGISTRY } from "@/features/board/components/submission/display/registry";
import { DISPLAY_TYPE_REGISTRY } from "@/features/template/constants/widget/displayTypes";
import { DisplayType } from "@/types/display-type";
import { TomatoIcon } from "@tomato/icon";

export interface BoardColumnCellProps {
  type: DisplayType | null;
}

const BoardColumnCell: React.FC<BoardColumnCellProps> = ({
  type,
  displayValue,
}) => {
  if (type === null) return <div className="min-w-[150px]" />;

  const definition = DISPLAY_TYPE_REGISTRY[type];
  const DisplayComponent = DISPLAY_VALUE_REGISTRY[type];

  return (
    <div className="flex min-w-[150px] items-center gap-1.5 text-sm text-muted-foreground">
      <TomatoIcon icon={definition.icon} className="size-3.5" />
      <DisplayComponent displayValue={displayValue} />
    </div>
  );
};

export default BoardColumnCell;
