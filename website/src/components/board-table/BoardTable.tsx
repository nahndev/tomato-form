import * as React from "react";
import { BoardTableProvider } from "./BoardTableContext";

export interface BoardTableProps<Row, Column> {
  columns: Column[];
  rows: Row[];
  children: React.ReactNode;
}

export default function BoardTable<Row, Column>({
  columns,
  rows,
  children,
}: BoardTableProps<Row, Column>) {
  return (
    <BoardTableProvider value={{ columns, rows }}>
      <div
        role="table"
        className="grid gap-2"
        style={{
          gridTemplateColumns: `minmax(140px, auto) repeat(${columns.length}, minmax(150px, 1fr)) auto`,
        }}
      >
        {children}
      </div>
    </BoardTableProvider>
  );
}
