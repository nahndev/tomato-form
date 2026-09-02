import * as React from "react";

export interface BoardRowActionProps<Row> {
  children: React.ReactNode;
}

export default function BoardRowAction<Row>({
  children,
}: BoardRowActionProps<Row>) {
  return <div role="cell">{children}</div>;
}
