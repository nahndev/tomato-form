import { Button } from "@/components/ui/button";
import type { BoardColumn } from "@/types/board";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { v4 } from "uuid";

export interface AddColumnButtonProps {
  onAdd: (column: BoardColumn) => void;
}

const AddColumnButton: React.FC<AddColumnButtonProps> = ({ onAdd }) => {
  function handleClick() {
    onAdd({ id: v4(), type: null, size: null, label: null, items: [] });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      className="border-dashed"
    >
      <TomatoIcon icon={TomatoIconKey.Plus} className="mr-1.5 size-4" />
      Add column
    </Button>
  );
};

export default AddColumnButton;
