"use client";

import * as React from "react";

interface BoardTableContextValue<Row, Column> {
  columns: Column[];
  rows: Row[];
}

const BoardTableContext = React.createContext<BoardTableContextValue<unknown, unknown> | null>(
  null,
);

export function useBoardTableContext<Row, Column>(): BoardTableContextValue<Row, Column> {
  const context = React.useContext(BoardTableContext);
  if (!context) {
    throw new Error("BoardTable components must be rendered within a <BoardTable>");
  }
  return context as BoardTableContextValue<Row, Column>;
}

export const BoardTableProvider = BoardTableContext.Provider as React.Provider<
  BoardTableContextValue<unknown, unknown>
>;
