import * as React from "react";
import BoardColumnAction from "./BoardColumnAction";
import BoardColumnHeader from "./BoardColumnHeader";

export interface BoardHeaderProps<Column> {
  rowHeaderLabel?: React.ReactNode;
  columns: Column[];
  getColumnId: (column: Column) => string;
  renderColumnHeader: (column: Column) => React.ReactNode;
  renderColumnAction?: () => React.ReactNode;
}

export default function BoardHeader<Column>({
  rowHeaderLabel,
  columns,
  getColumnId,
  renderColumnHeader,
  renderColumnAction,
}: BoardHeaderProps<Column>) {
  return (
    <div role="row" className="contents">
      <div
        role="columnheader"
        className="text-left text-xs font-medium text-muted-foreground"
      >
        {rowHeaderLabel}
      </div>
      {columns.map((column) => (
        <BoardColumnHeader
          key={getColumnId(column)}
          column={column}
          render={renderColumnHeader}
        />
      ))}
      {renderColumnAction && <BoardColumnAction render={renderColumnAction} />}
    </div>
  );
}
