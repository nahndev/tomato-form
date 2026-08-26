import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { ListTableColumn } from "./ListTable";

interface ListTableHeaderProps<T> {
  columns: ListTableColumn<T>[];
  allSelected: boolean;
  someSelected: boolean;
  onToggleAll: () => void;
  hasRowMenu: boolean;
}

export default function ListTableHeader<T>({
  columns,
  allSelected,
  someSelected,
  onToggleAll,
  hasRowMenu,
}: ListTableHeaderProps<T>) {
  return (
    <div className="flex items-center gap-2 border-b px-2">
      <div className="flex h-10 w-10 shrink-0 items-center">
        <Checkbox
          checked={allSelected ? true : someSelected ? "indeterminate" : false}
          onCheckedChange={onToggleAll}
          aria-label="Select all"
        />
      </div>

      {columns.map((column) => (
        <div
          key={column.id}
          className={cn(
            "flex h-10 flex-1 items-center text-left text-sm font-medium whitespace-nowrap text-foreground",
            column.className,
          )}
        >
          {column.header}
        </div>
      ))}

      {hasRowMenu && <div className="h-10 w-10 shrink-0" />}
    </div>
  );
}
