import * as React from "react";
import BoardRowAction from "./BoardRowAction";
import BoardRowContent from "./BoardRowContent";
import BoardRowHeader from "./BoardRowHeader";

export interface BoardRowProps<Row, Column> {
  row: Row;
  columns: Column[];
  getColumnId: (column: Column) => string;
  renderRowHeader: (row: Row) => React.ReactNode;
  renderRowContent: (row: Row, column: Column) => React.ReactNode;
  renderRowAction?: (row: Row, column: Column) => React.ReactNode;
}

export default function BoardRow<Row, Column>({
  row,
  columns,
  getColumnId,
  renderRowHeader,
  renderRowContent,
  renderRowAction,
}: BoardRowProps<Row, Column>) {
  return (
    <div role="row" className="contents">
      <BoardRowHeader row={row} render={renderRowHeader} />
      {columns.map((column) => (
        <div key={getColumnId(column)} role="cell" className="flex items-center gap-2">
          <BoardRowContent row={row} column={column} render={renderRowContent} />
          {renderRowAction && (
            <BoardRowAction row={row} column={column} render={renderRowAction} />
          )}
        </div>
      ))}
    </div>
  );
}
