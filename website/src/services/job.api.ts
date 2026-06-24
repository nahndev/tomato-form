import type {
  CreateJobInput,
  Job,
  JobExecution,
  UpdateJobInput,
} from "@/types/job";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3029/api",
});

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const jobApi = {
  list(boardId: string): Promise<Job[]> {
    return api
      .get<ApiResponse<Job[]>>(`/boards/${boardId}/jobs`)
      .then((r) => r.data.data);
  },

  get(id: string): Promise<Job> {
    return api.get<ApiResponse<Job>>(`/jobs/${id}`).then((r) => r.data.data);
  },

  create(boardId: string, input: CreateJobInput): Promise<Job> {
    return api
      .post<ApiResponse<Job>>(`/boards/${boardId}/jobs`, input)
      .then((r) => r.data.data);
  },

  update(id: string, input: UpdateJobInput): Promise<Job> {
    return api
      .put<ApiResponse<Job>>(`/jobs/${id}`, input)
      .then((r) => r.data.data);
  },

  remove(id: string): Promise<void> {
    return api.delete(`/jobs/${id}`).then(() => undefined);
  },

  listExecutions(jobId: string): Promise<JobExecution[]> {
    return api
      .get<ApiResponse<JobExecution[]>>(`/jobs/${jobId}/executions`)
      .then((r) => r.data.data);
  },
};
