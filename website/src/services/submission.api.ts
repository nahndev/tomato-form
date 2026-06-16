import type {
  CreateSubmissionInput,
  Submission,
  UpdateSubmissionInput,
} from "@/types/submission";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3029/api",
});

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const submissionApi = {
  list(boardId?: string): Promise<Submission[]> {
    return api
      .get<ApiResponse<Submission[]>>("/submissions", { params: { boardId } })
      .then((r) => r.data.data);
  },

  get(id: string): Promise<Submission> {
    return api
      .get<ApiResponse<Submission>>(`/submissions/${id}`)
      .then((r) => r.data.data);
  },

  create(input: CreateSubmissionInput): Promise<Submission> {
    return api
      .post<ApiResponse<Submission>>("/submissions", input)
      .then((r) => r.data.data);
  },

  update(id: string, input: UpdateSubmissionInput): Promise<Submission> {
    return api
      .put<ApiResponse<Submission>>(`/submissions/${id}`, input)
      .then((r) => r.data.data);
  },

  remove(id: string): Promise<void> {
    return api.delete(`/submissions/${id}`).then(() => undefined);
  },
};
