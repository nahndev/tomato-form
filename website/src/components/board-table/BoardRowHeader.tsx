import * as React from "react";

export interface BoardRowHeaderProps<Row> {
  row: Row;
  children: React.ReactNode;
}

export default function BoardRowHeader<Row>({ children }: BoardRowHeaderProps<Row>) {
  return <div role="cell">{children}</div>;
}
