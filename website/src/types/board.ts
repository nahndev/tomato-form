export enum BoardTabValue {
  SUBMISSIONS = "submissions",
  TEMPLATE = "template",
  JOBS = "jobs",
  SETTING = "setting",
  HISTORY = "history",
  DISCUSSION = "discussion",
}

export interface Board {
  id: string;
  name: string;
  templateIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBoardInput {
  name: string;
  templateIds?: string[];
}

export type UpdateBoardInput = Partial<CreateBoardInput>;
