"use client";

import { Button } from "@/components/ui/button";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";

export interface BoardSettingActionsProps {
  onSave: () => void;
  isPending: boolean;
  isDirty: boolean;
}

const BoardSettingActions: React.FC<BoardSettingActionsProps> = ({
  onSave,
  isPending,
  isDirty,
}) => {
  return (
    <div className="flex justify-end">
      <Button
        onClick={onSave}
        disabled={isPending || !isDirty}
        aria-label="Save columns"
      >
        {isPending ? (
          <TomatoIcon
            icon={TomatoIconKey.Loader}
            className="size-4 animate-spin"
          />
        ) : (
          "Save"
        )}
      </Button>
    </div>
  );
};

export default BoardSettingActions;
