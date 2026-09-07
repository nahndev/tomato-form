import { DISPLAY_VALUE_REGISTRY } from "@/features/board/components/submission/display/registry";
import { getColumnSizeStyle } from "@/features/board/utils/boardColumnWidgets";
import { DISPLAY_TYPE_REGISTRY } from "@/features/template/constants/widget/displayTypes";
import { BoardColumn } from "@/types/board";
import { SubmissionDisplayValue } from "@/types/submission-display";
import { TomatoIcon } from "@tomato/icon";
import { useMemo } from "react";

export interface BoardColumnCellProps {
  column: BoardColumn;
  displayValue: SubmissionDisplayValue | undefined;
}

const BoardColumnCell: React.FC<BoardColumnCellProps> = ({
  column,
  displayValue,
}) => {
  const type = useMemo(() => column.type, [column]);

  const definition = DISPLAY_TYPE_REGISTRY[type];
  const DisplayComponent = DISPLAY_VALUE_REGISTRY[type];

  return (
    <div
      className="flex items-center gap-1.5 text-sm text-muted-foreground"
      style={getColumnSizeStyle(column.size)}
    >
      <TomatoIcon icon={definition.icon} className="size-3.5" />
      <DisplayComponent displayValue={displayValue} />
    </div>
  );
};

export default BoardColumnCell;
