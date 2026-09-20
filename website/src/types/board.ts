import type { BoardView } from "./board-view";
import type { DisplayType } from "./display-type";
import type { Template } from "./template";

export const BoardTabValue = {
  SETTING: "setting",
  VIEWS: "views",
  HISTORY: "history",
  DISCUSSION: "discussion",
} as const;
export type BoardTabValue = (typeof BoardTabValue)[keyof typeof BoardTabValue];

export type ColumnSize = { width: number } | { flex: number };

export interface BoardColumnItem {
  widgetId: string;
  property: string;
}

export interface BoardColumn {
  id: string;
  type: DisplayType;
  size: ColumnSize;
  label: string;
  /** Map of templateId to the widget picked from that template, and which value-property of it to display. */
  items: Record<string, BoardColumnItem>;
}

/** Shape of a column while it's being edited on the board settings screen, before it's ready to save. */
export type BoardColumnDraft = Partial<BoardColumn>;

export interface Board {
  id: string;
  name: string;
  templates: Template[];
  columns: BoardColumn[];
  views: BoardView[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBoardInput {
  name: string;
  templateIds?: string[];
  columns?: BoardColumn[];
  views?: BoardView[];
}

export type UpdateBoardInput = Partial<CreateBoardInput>;
