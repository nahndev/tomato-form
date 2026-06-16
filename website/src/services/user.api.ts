import type { CreateUserInput, UpdateUserInput, User } from "@/types/user";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3029/api",
});

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const userApi = {
  list(): Promise<User[]> {
    return api.get<ApiResponse<User[]>>("/users").then((r) => r.data.data);
  },

  get(uuid: string): Promise<User> {
    return api
      .get<ApiResponse<User>>(`/users/${uuid}`)
      .then((r) => r.data.data);
  },

  create(input: CreateUserInput): Promise<User> {
    return api
      .post<ApiResponse<User>>("/users", input)
      .then((r) => r.data.data);
  },

  update(uuid: string, input: UpdateUserInput): Promise<User> {
    return api
      .put<ApiResponse<User>>(`/users/${uuid}`, input)
      .then((r) => r.data.data);
  },

  remove(uuid: string): Promise<void> {
    return api.delete(`/users/${uuid}`).then(() => undefined);
  },
};
