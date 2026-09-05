import type { DisplayType } from "./display-type";
import type { Template } from "./template";

export const BoardTabValue = {
  SETTING: "setting",
  HISTORY: "history",
  DISCUSSION: "discussion",
} as const;
export type BoardTabValue = (typeof BoardTabValue)[keyof typeof BoardTabValue];

export interface BoardColumnItem {
  templateId: string;
  widgetId: string;
}

export type ColumnSize = { width: number } | { flex: number };

export interface BoardColumn {
  id: string;
  type: DisplayType | null;
  size: ColumnSize | null;
  label: string | null;
  items: BoardColumnItem[];
}

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
