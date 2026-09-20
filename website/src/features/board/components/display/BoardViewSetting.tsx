"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import BoardViewListItem from "@/features/board/components/display/BoardViewListItem";
import BoardViewTypePickerDialog from "@/features/board/components/display/BoardViewTypePickerDialog";
import ChartSettingPopup from "@/features/board/components/display/ChartSettingPopup";
import { useBoardContext } from "@/features/board/components/provider/BoardProvider";
import { BoardViewType } from "@/types/board-view";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { useState } from "react";

/** Views settings tab: a list of the board's views, and a create flow (skeleton -> type picker -> settings popup). */
const BoardViewSetting: React.FC = () => {
  const board = useBoardContext();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [createChartOpen, setCreateChartOpen] = useState(false);

  function handlePickType(type: BoardViewType) {
    setPickerOpen(false);
    if (type === BoardViewType.CHART) setCreateChartOpen(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Add alternate ways to view this board&apos;s submissions, like a chart grouped
        and aggregated by a field.
      </p>

      {board.views.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-10 text-center">
          <TomatoIcon
            icon={TomatoIconKey.LayoutGrid}
            className="mb-3 size-8 text-muted-foreground/40"
          />
          <h3 className="text-sm font-semibold text-muted-foreground">No views yet</h3>
          <p className="mt-1 text-xs text-muted-foreground/70">
            Create a view to see submissions as a chart.
          </p>
        </div>
      ) : (
        <ScrollArea className="max-h-80">
          <div className="flex flex-col gap-2">
            {board.views.map((view) => (
              <BoardViewListItem key={view.id} board={board} view={view} />
            ))}
          </div>
        </ScrollArea>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={() => setPickerOpen(true)}
      >
        <TomatoIcon icon={TomatoIconKey.Plus} className="size-4" />
        Add view
      </Button>

      <BoardViewTypePickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onPickType={handlePickType}
      />
      <ChartSettingPopup
        board={board}
        open={createChartOpen}
        onOpenChange={setCreateChartOpen}
      />
    </div>
  );
};

export default BoardViewSetting;
