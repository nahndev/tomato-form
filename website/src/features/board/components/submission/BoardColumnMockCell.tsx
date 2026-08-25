import { DISPLAY_TYPE_REGISTRY } from "@/features/template/components/widget/display-type.registry";
import { DisplayType } from "@/types/display-type";
import { TomatoIcon } from "@tomato/icon";

const MOCK_VALUE: Record<DisplayType, string> = {
  [DisplayType.TEXT]: "Sample text",
  [DisplayType.DATE]: new Date().toLocaleDateString(),
  [DisplayType.NUMBER]: "123",
};

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
