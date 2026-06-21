import type { Board } from "@/types/board";
import { createContext, useContext } from "react";

const BoardContext = createContext<Board | null>(null);

export interface BoardProviderProps {
  board: Board;
  children: React.ReactNode;
}

export const BoardProvider: React.FC<BoardProviderProps> = ({
  board,
  children,
}) => {
  return (
    <BoardContext.Provider value={board}>{children}</BoardContext.Provider>
  );
};

export function useBoardContext(): Board {
  const ctx = useContext(BoardContext);
  if (!ctx) {
    throw new Error("useBoardContext must be used inside BoardProvider");
  }
  return ctx;
}
