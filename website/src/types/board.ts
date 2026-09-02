import type { DisplayType } from "./display-type";
import type { Template } from "./template";

export const BoardTabValue = {
  TEMPLATE: "template",
  SETTING: "setting",
  HISTORY: "history",
  DISCUSSION: "discussion",
} as const;
export type BoardTabValue = (typeof BoardTabValue)[keyof typeof BoardTabValue];

export interface BoardColumnItem {
  templateId: string;
  widgetId: string;
}

export interface BoardColumn {
  id: string;
  /** null while the column has no widget picked yet (not saveable). */
  type: DisplayType | null;
  /** null until a size is set (not saveable). */
  size: number | null;
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
