"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BOARD_VIEW_TYPE_REGISTRY } from "@/features/board/constants/view/boardViewTypes";
import type { BoardView } from "@/types/board-view";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";

/** Local sentinel for "no view selected" - the default list/table display. */
export const TABLE_VIEW_ID = "table";

export interface BoardViewSwitcherProps {
  views: BoardView[];
  activeViewId: string;
  onChange: (viewId: string) => void;
}

const BoardViewSwitcher: React.FC<BoardViewSwitcherProps> = ({
  views,
  activeViewId,
  onChange,
}) => {
  if (views.length === 0) return null;

  return (
    <ToggleGroup
      type="single"
      value={activeViewId}
      onValueChange={(value) => value && onChange(value)}
      aria-label="Board view"
    >
      <ToggleGroupItem value={TABLE_VIEW_ID} aria-label="Table view">
        <TomatoIcon icon={TomatoIconKey.List} className="size-3.5" />
        Table
      </ToggleGroupItem>
      {views.map((view) => (
        <ToggleGroupItem key={view.id} value={view.id} aria-label={`${view.name} view`}>
          <TomatoIcon icon={BOARD_VIEW_TYPE_REGISTRY[view.type].icon} className="size-3.5" />
          {view.name}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default BoardViewSwitcher;
