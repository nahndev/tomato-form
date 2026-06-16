export interface User {
  uuid: string;
  name: string;
  email?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserInput {
  name: string;
  email?: string | null;
}

export type UpdateUserInput = Partial<CreateUserInput>;
