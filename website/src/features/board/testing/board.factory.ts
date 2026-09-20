import { DisplayType } from "@/types/display-type";
import type { Board, BoardColumn, BoardColumnDraft } from "@/types/board";
import { ChartAggregation, ChartKind } from "@/types/board-view";
import type { BoardChartViewConfig, BoardView } from "@/types/board-view";
import type { Submission } from "@/types/submission";
import { mockId } from "@/lib/testing/mockId";

export function getMockBoardColumn(
  overrides?: Partial<BoardColumn>,
): BoardColumn {
  return {
    id: mockId("column"),
    type: DisplayType.TEXT,
    size: { width: 150 },
    label: "Column",
    items: {},
    ...overrides,
  };
}

export function getMockBoardColumnDraft(
  overrides?: BoardColumnDraft,
): BoardColumnDraft {
  return {
    id: mockId("column"),
    items: {},
    ...overrides,
  };
}

export function getMockBoardChartViewConfig(
  overrides?: Partial<BoardChartViewConfig>,
): BoardChartViewConfig {
  return {
    groupBy: { "template-1": "widget-1:default" },
    aggregation: ChartAggregation.COUNT,
    chartKind: ChartKind.BAR,
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
    templates: [],
    columns: [],
    views: [],
    ...overrides,
  };
}

export function getMockSubmission(overrides?: Partial<Submission>): Submission {
  return {
    id: mockId("submission"),
    boardId: mockId("board"),
    templateId: mockId("template"),
    data: {},
    dataDisplays: {},
    ...overrides,
  };
}
