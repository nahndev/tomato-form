import type { DisplayType } from "./display-type";
import type { Template } from "./template";

export const BoardTabValue = {
  SETTING: "setting",
  HISTORY: "history",
  DISCUSSION: "discussion",
} as const;
export type BoardTabValue = (typeof BoardTabValue)[keyof typeof BoardTabValue];

export type ColumnSize = { width: number } | { flex: number };

export interface BoardColumn {
  id: string;
  type: DisplayType;
  size: ColumnSize;
  label: string;
  items: Record<string, string>;
}

/** Shape of a column while it's being edited on the board settings screen, before it's ready to save. */
export type BoardColumnDraft = Partial<BoardColumn>;

export interface Board {
  id: string;
  name: string;
  templates: Template[];
  columns: BoardColumn[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBoardInput {
  name: string;
  templateIds?: string[];
  columns?: BoardColumn[];
}

export type UpdateBoardInput = Partial<CreateBoardInput>;
