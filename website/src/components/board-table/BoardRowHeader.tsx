import * as React from "react";

export interface BoardRowHeaderProps<Row> {
  row: Row;
  children: React.ReactNode;
}

export default function BoardRowHeader<Row>({ children }: BoardRowHeaderProps<Row>) {
  return (
    <div role="cell" className="flex items-center">
      {children}
    </div>
  );
}
