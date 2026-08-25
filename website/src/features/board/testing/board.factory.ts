import { DisplayType } from "@/types/display-type";
import type { Board, BoardColumn, BoardColumnItem } from "@/types/board";
import { mockId } from "@/lib/testing/mockId";

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
    type: DisplayType.TEXT,
    size: 150,
    items: [],
    ...overrides,
  };
}

export function getMockBoard(overrides?: Partial<Board>): Board {
  return {
    id: mockId("board"),
    name: "Board",
    templates: [],
    columns: [],
    ...overrides,
  };
}
