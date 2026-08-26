"use client";

import { Button } from "@/components/ui/button";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import * as React from "react";
import ListTableContent from "./ListTableContent";
import ListTableHeader from "./ListTableHeader";

export interface ListTableColumn<T> {
  id: string;
  header: React.ReactNode;
  cell: (item: T) => React.ReactNode;
  className?: string;
}

export interface ListTableGroup {
  key: string;
  label: React.ReactNode;
}

export interface ListTableProps<T> {
  items: T[];
  getId: (item: T) => string;
  columns: ListTableColumn<T>[];
  groupBy?: (item: T) => ListTableGroup;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  emptyState?: React.ReactNode;
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  renderToolbar?: (ctx: {
    selectedIds: Set<string>;
    clear: () => void;
  }) => React.ReactNode;
  renderRowMenu?: (item: T) => React.ReactNode;
  onRowDoubleClick?: (item: T) => void;
}

export function ListTable<T>({
  items,
  getId,
  columns,
  groupBy,
  isLoading,
  isError,
  onRetry,
  emptyState,
  selectedIds,
  onSelectionChange,
  renderToolbar,
  renderRowMenu,
  onRowDoubleClick,
}: ListTableProps<T>) {
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 py-16 text-center">
        <p className="font-semibold text-destructive">Failed to load</p>
        <p className="mt-1 text-sm text-muted-foreground">Please try again.</p>
        {onRetry && (
          <Button
            size="sm"
            variant="outline"
            className="mt-4"
            onClick={onRetry}
          >
            Try Again
          </Button>
        )}
      </div>
    );
  }

  if (isLoading && items.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <TomatoIcon
          icon={TomatoIconKey.Loader}
          className="size-6 animate-spin text-muted-foreground"
        />
      </div>
    );
  }

  if (items.length === 0) {
    return <>{emptyState}</>;
  }

  const allSelected = items.every((item) => selectedIds.has(getId(item)));
  const someSelected = items.some((item) => selectedIds.has(getId(item)));

  const toggleRow = (item: T) => {
    const id = getId(item);
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectionChange(next);
  };

  const toggleAll = () => {
    onSelectionChange(allSelected ? new Set() : new Set(items.map(getId)));
  };

  const clearSelection = () => onSelectionChange(new Set());
  const showToolbar = selectedIds.size > 0 && Boolean(renderToolbar);

  return (
    <div className="rounded-lg border">
      <div className="flex h-10 items-center bg-muted/40 px-2 text-sm">
        {showToolbar && renderToolbar ? (
          renderToolbar({ selectedIds, clear: clearSelection })
        ) : (
          <ListTableHeader
            columns={columns}
            allSelected={allSelected}
            someSelected={someSelected}
            onToggleAll={toggleAll}
            hasRowMenu={Boolean(renderRowMenu)}
          />
        )}
      </div>
      <ListTableContent
        items={items}
        getId={getId}
        columns={columns}
        groupBy={groupBy}
        selectedIds={selectedIds}
        onToggleRow={toggleRow}
        renderRowMenu={renderRowMenu}
        onRowDoubleClick={onRowDoubleClick}
      />
    </div>
  );
}
