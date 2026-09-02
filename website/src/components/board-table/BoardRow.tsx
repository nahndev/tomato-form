import * as React from "react";
import { useBoardTableContext } from "./BoardTableContext";

export interface BoardRowProps<Row, Column> {
  row: Row;
  children: (row: Row, columns: Column[]) => React.ReactNode;
}

export default function BoardRow<Row, Column>({ row, children }: BoardRowProps<Row, Column>) {
  const { columns } = useBoardTableContext<Row, Column>();

  return (
    <div role="row" className="contents">
      {children(row, columns)}
    </div>
  );
}
