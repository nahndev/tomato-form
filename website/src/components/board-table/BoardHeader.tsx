import * as React from "react";
import { useBoardTableContext } from "./BoardTableContext";

export interface BoardHeaderProps<Row, Column> {
  children: (columns: Column[]) => React.ReactNode;
}

export default function BoardHeader<Row, Column>({ children }: BoardHeaderProps<Row, Column>) {
  const { columns } = useBoardTableContext<Row, Column>();

  return (
    <div role="row" className="contents">
      {children(columns)}
    </div>
  );
}
