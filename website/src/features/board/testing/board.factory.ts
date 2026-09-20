import { DisplayType } from "@/types/display-type";
import type { Board, BoardColumn, BoardColumnDraft } from "@/types/board";
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

export function getMockBoard(overrides?: Partial<Board>): Board {
  return {
    id: mockId("board"),
    name: "Board",
    templates: [],
    columns: [],
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
