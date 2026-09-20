import type { Board } from "@/database/prisma-client";
import type { BoardColumn } from "../board.types";
import type { BoardChartViewConfig, BoardView } from "../board-view.types";

let counter = 0;
function mockId(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}`;
}

export function getMockBoardColumn(
  overrides?: Partial<BoardColumn>,
): BoardColumn {
  return {
    id: mockId("column"),
    type: "text",
    size: { width: 150 },
    label: null,
    items: {},
    ...overrides,
  };
}

export function getMockBoardChartViewConfig(
  overrides?: Partial<BoardChartViewConfig>,
): BoardChartViewConfig {
  return {
    groupBy: { "template-1": "widget-1:default" },
    aggregation: "count",
    chartKind: "bar",
    ...overrides,
  };
}

export function getMockBoardView(overrides?: Partial<BoardView>): BoardView {
  return {
    id: mockId("view"),
    name: "Chart view",
    type: "chart",
    config: getMockBoardChartViewConfig(),
    ...overrides,
  };
}

export function getMockBoard(overrides?: Partial<Board>): Board {
  return {
    id: mockId("board"),
    name: "Board",
    columns: [],
    views: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as Board;
}
