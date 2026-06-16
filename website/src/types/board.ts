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
