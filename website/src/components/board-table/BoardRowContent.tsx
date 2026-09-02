import * as React from "react";

export interface BoardRowContentProps<Row, Column> {
  row: Row;
  column: Column;
  children: React.ReactNode;
}

export default function BoardRowContent<Row, Column>({
  children,
}: BoardRowContentProps<Row, Column>) {
  return <div role="cell">{children}</div>;
}
