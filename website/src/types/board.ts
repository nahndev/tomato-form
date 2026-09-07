import type { DisplayType } from "./display-type";
import type { TemplateVersion } from "./template";

export const BoardTabValue = {
  SETTING: "setting",
  HISTORY: "history",
  DISCUSSION: "discussion",
} as const;
export type BoardTabValue = (typeof BoardTabValue)[keyof typeof BoardTabValue];

export type ColumnSize = { width: number } | { flex: number };

export interface BoardColumn {
  id: string;
  type: DisplayType | null;
  size: ColumnSize | null;
  label: string | null;
  /** Map of templateVersionId to the widgetId picked from that version. */
  items: Record<string, string>;
}

export interface Board {
  id: string;
  name: string;
  templateVersions: TemplateVersion[];
  columns: BoardColumn[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBoardInput {
  name: string;
  templateVersionIds?: string[];
  columns?: BoardColumn[];
}

export type UpdateBoardInput = Partial<CreateBoardInput>;
