import * as React from "react";
import BoardFooter from "./BoardFooter";
import BoardHeader from "./BoardHeader";
import BoardRow from "./BoardRow";

export interface BoardTableProps<Row, Column> {
  columns: Column[];
  getColumnId: (column: Column) => string;
  renderColumnHeader: (column: Column) => React.ReactNode;
  renderColumnAction?: () => React.ReactNode;

  rows: Row[];
  getRowId: (row: Row) => string;
  renderRowHeader: (row: Row) => React.ReactNode;
  renderRowContent: (row: Row, column: Column) => React.ReactNode;
  renderRowAction?: (row: Row, column: Column) => React.ReactNode;

  rowHeaderLabel?: React.ReactNode;
  renderFooter?: () => React.ReactNode;
  emptyState?: React.ReactNode;
  className?: string;
}

/** Generic column x row matrix grid, rendered as an ARIA table via CSS grid `contents` rows. */
export function BoardTable<Row, Column>({
  columns,
  getColumnId,
  renderColumnHeader,
  renderColumnAction,
  rows,
  getRowId,
  renderRowHeader,
  renderRowContent,
  renderRowAction,
  rowHeaderLabel,
  renderFooter,
  emptyState,
  className,
}: BoardTableProps<Row, Column>) {
  const columnCount = columns.length + 1 + (renderColumnAction ? 1 : 0);

  return (
    <div className={className ? `overflow-x-auto ${className}` : "overflow-x-auto"}>
      <div
        role="table"
        className="grid gap-2"
        style={{
          gridTemplateColumns: `minmax(140px, auto) repeat(${columns.length}, minmax(150px, 1fr))${
            renderColumnAction ? " auto" : ""
          }`,
        }}
      >
        <BoardHeader
          rowHeaderLabel={rowHeaderLabel}
          columns={columns}
          getColumnId={getColumnId}
          renderColumnHeader={renderColumnHeader}
          renderColumnAction={renderColumnAction}
        />

        {rows.length === 0 && emptyState && (
          <div role="row" className="contents">
            <div
              role="cell"
              style={{ gridColumn: `1 / span ${columnCount}` }}
              className="py-4 text-center text-sm text-muted-foreground"
            >
              {emptyState}
            </div>
          </div>
        )}

        {rows.map((row) => (
          <BoardRow
            key={getRowId(row)}
            row={row}
            columns={columns}
            getColumnId={getColumnId}
            renderRowHeader={renderRowHeader}
            renderRowContent={renderRowContent}
            renderRowAction={renderRowAction}
          />
        ))}

        {renderFooter && <BoardFooter render={renderFooter} />}
      </div>
    </div>
  );
}
