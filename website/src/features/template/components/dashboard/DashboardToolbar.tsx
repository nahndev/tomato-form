"use client";

import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { Button } from "@/components/ui/button";

interface DashboardToolbarProps {
  selectedCount: number;
  isDeleting: boolean;
  onClear: () => void;
  onDelete: () => void;
}

const DashboardToolbar: React.FC<DashboardToolbarProps> = ({
  selectedCount,
  isDeleting,
  onClear,
  onDelete,
}) => {
  return (
    <div className="flex items-center gap-3">
      <span>{selectedCount} selected</span>
      <Button variant="outline" size="sm" onClick={onClear} disabled={isDeleting}>
        Clear
      </Button>
      <Button variant="destructive" size="sm" disabled={isDeleting} onClick={onDelete}>
        {isDeleting ? (
          <>
            <TomatoIcon icon={TomatoIconKey.Loader} className="animate-spin" />
            Deleting…
          </>
        ) : (
          "Delete"
        )}
      </Button>
    </div>
  );
};

export default DashboardToolbar;
