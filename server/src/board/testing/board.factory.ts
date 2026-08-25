import type { Board } from "@/database/prisma-client";
import type { BoardColumn, BoardColumnItem } from "../board.types";

let counter = 0;
function mockId(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}`;
}

export function getMockBoardColumnItem(
  overrides?: Partial<BoardColumnItem>,
): BoardColumnItem {
  return {
    templateId: mockId("template"),
    widgetId: mockId("widget"),
    ...overrides,
  };
}

export function getMockBoardColumn(
  overrides?: Partial<BoardColumn>,
): BoardColumn {
  return {
    id: mockId("column"),
    type: "text",
    size: 150,
    items: [],
    ...overrides,
  };
}

export function getMockBoard(overrides?: Partial<Board>): Board {
  return {
    id: mockId("board"),
    name: "Board",
    columns: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as Board;
}
