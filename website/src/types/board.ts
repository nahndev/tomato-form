import type { Template } from "./template";

export enum BoardTabValue {
  TEMPLATE = "template",
  SETTING = "setting",
  HISTORY = "history",
  DISCUSSION = "discussion",
}

export interface Board {
  id: string;
  name: string;
  templates: Template[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBoardInput {
  name: string;
  templateIds?: string[];
}

export type UpdateBoardInput = Partial<CreateBoardInput>;
