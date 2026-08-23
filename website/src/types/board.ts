import type { Template } from "./template";
import type { Job } from "./job";

export enum BoardTabValue {
  TEMPLATE = "template",
  JOBS = "jobs",
  SETTING = "setting",
  HISTORY = "history",
  DISCUSSION = "discussion",
}

export interface Board {
  id: string;
  name: string;
  templates: Template[];
  jobs: Job[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBoardInput {
  name: string;
  templateIds?: string[];
}

export type UpdateBoardInput = Partial<CreateBoardInput>;
