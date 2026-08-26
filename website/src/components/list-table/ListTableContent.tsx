import { Fragment } from "react";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ListTableColumn, ListTableGroup } from "./ListTable";

interface ListTableContentProps<T> {
  items: T[];
  getId: (item: T) => string;
  columns: ListTableColumn<T>[];
  groupBy?: (item: T) => ListTableGroup;
  selectedIds: Set<string>;
  onToggleRow: (item: T) => void;
  renderRowMenu?: (item: T) => React.ReactNode;
  onRowDoubleClick?: (item: T) => void;
}

interface Bucket<T> {
  group: ListTableGroup;
  items: T[];
}

function bucketByGroup<T>(items: T[], groupBy?: (item: T) => ListTableGroup): Bucket<T>[] {
  if (!groupBy) {
    return [{ group: { key: "__all__", label: null }, items }];
  }

  const order: string[] = [];
  const buckets = new Map<string, Bucket<T>>();

  for (const item of items) {
    const group = groupBy(item);
    if (!buckets.has(group.key)) {
      buckets.set(group.key, { group, items: [] });
      order.push(group.key);
    }
    buckets.get(group.key)!.items.push(item);
  }

  return order.map((key) => buckets.get(key)!);
}

export default function ListTableContent<T>({
  items,
  getId,
  columns,
  groupBy,
  selectedIds,
  onToggleRow,
  renderRowMenu,
  onRowDoubleClick,
}: ListTableContentProps<T>) {
  const buckets = bucketByGroup(items, groupBy);

  return (
    <div>
      {buckets.map((bucket) => (
        <Fragment key={bucket.group.key}>
          {groupBy && (
            <div className="border-b bg-muted/30 px-2 py-1.5 text-xs font-medium whitespace-nowrap text-muted-foreground">
              {bucket.group.label}
            </div>
          )}

          {bucket.items.map((item) => {
            const id = getId(item);
            const isSelected = selectedIds.has(id);

            return (
              <div
                key={id}
                data-state={isSelected ? "selected" : undefined}
                className="flex cursor-pointer items-center gap-2 border-b px-2 transition-colors last:border-0 hover:bg-muted/50 data-[state=selected]:bg-muted"
                onClick={() => onToggleRow(item)}
                onDoubleClick={() => onRowDoubleClick?.(item)}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleRow(item)}
                    aria-label="Select row"
                  />
                </div>

                {columns.map((column) => (
                  <div
                    key={column.id}
                    className={cn("flex h-10 flex-1 items-center whitespace-nowrap", column.className)}
                  >
                    {column.cell(item)}
                  </div>
                ))}

                {renderRowMenu && (
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label="Row actions">
                          <TomatoIcon icon={TomatoIconKey.MoreHorizontal} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {renderRowMenu(item)}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}
