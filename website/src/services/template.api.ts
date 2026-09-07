import type {
  CreateTemplateInput,
  Template,
  UpdateTemplateInput,
} from "@/types/template";
import type { TemplateMigration } from "@/types/template-migration";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
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

  publish(id: string): Promise<{ migration: TemplateMigration; template: Template }> {
    return api
      .post<ApiResponse<{ migration: TemplateMigration; template: Template }>>(
        `/templates/${id}/publish`,
      )
      .then((r) => r.data.data);
  },
};
