import type {
  CreateTemplateInput,
  Template,
  UpdateTemplateInput,
} from "@/types/template";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3029/api",
});

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const templateApi = {
  list(): Promise<Template[]> {
    return api
      .get<ApiResponse<Template[]>>("/templates")
      .then((r) => r.data.data);
  },

  get(id: string): Promise<Template> {
    return api
      .get<ApiResponse<Template>>(`/templates/${id}`)
      .then((r) => r.data.data);
  },

  create(input: CreateTemplateInput): Promise<Template> {
    return api
      .post<ApiResponse<Template>>("/templates", input)
      .then((r) => r.data.data);
  },

  update(id: string, input: UpdateTemplateInput): Promise<Template> {
    return api
      .put<ApiResponse<Template>>(`/templates/${id}`, input)
      .then((r) => r.data.data);
  },

  remove(id: string): Promise<void> {
    return api.delete(`/templates/${id}`).then(() => undefined);
  },
};
