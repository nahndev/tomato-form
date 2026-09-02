import * as React from "react";

export interface BoardColumnHeaderProps<Column> {
  column: Column;
  children: React.ReactNode;
}

export default function BoardColumnHeader<Column>({ children }: BoardColumnHeaderProps<Column>) {
  return (
    <div
      role="columnheader"
      className="flex items-center text-left text-xs font-medium text-muted-foreground"
    >
      {children}
    </div>
  );
}
