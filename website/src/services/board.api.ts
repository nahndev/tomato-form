import type { Board, CreateBoardInput, UpdateBoardInput } from "@/types/board";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3029/api",
});

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const boardApi = {
  list(): Promise<Board[]> {
    return api.get<ApiResponse<Board[]>>("/boards").then((r) => r.data.data);
  },

  get(id: string): Promise<Board> {
    return api
      .get<ApiResponse<Board>>(`/boards/${id}`)
      .then((r) => r.data.data);
  },

  create(input: CreateBoardInput): Promise<Board> {
    return api
      .post<ApiResponse<Board>>("/boards", input)
      .then((r) => r.data.data);
  },

  update(id: string, input: UpdateBoardInput): Promise<Board> {
    return api
      .put<ApiResponse<Board>>(`/boards/${id}`, input)
      .then((r) => r.data.data);
  },

  remove(id: string): Promise<void> {
    return api.delete(`/boards/${id}`).then(() => undefined);
  },
};
