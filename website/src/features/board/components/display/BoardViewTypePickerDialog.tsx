"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BOARD_VIEW_TYPE_LIST } from "@/features/board/constants/view/boardViewTypes";
import { BoardViewType } from "@/types/board-view";
import { TomatoIcon } from "@tomato/icon";

export interface BoardViewTypePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPickType: (type: BoardViewType) => void;
}

/** Type picker shown when creating a view: default/highlighted choice is Chart; other types are shown but disabled until they get a settings UI (extend later, per the ticket). */
const BoardViewTypePickerDialog: React.FC<BoardViewTypePickerDialogProps> = ({
  open,
  onOpenChange,
  onPickType,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose a view type</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2">
          {BOARD_VIEW_TYPE_LIST.map((descriptor) => (
            <Button
              key={descriptor.type}
              type="button"
              variant={descriptor.type === BoardViewType.CHART ? "default" : "outline"}
              disabled={!descriptor.isConfigurable}
              className="h-20 flex-col gap-2"
              onClick={() => onPickType(descriptor.type)}
            >
              <TomatoIcon icon={descriptor.icon} className="size-5" />
              <span>{descriptor.label}</span>
              {!descriptor.isConfigurable && (
                <span className="text-[0.65rem] text-muted-foreground">Coming soon</span>
              )}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BoardViewTypePickerDialog;
