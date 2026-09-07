import type {
  ResolveTemplateMigrationInput,
  TemplateMigration,
} from "@/types/template-migration";
import type { Template } from "@/types/template";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const templateMigrationApi = {
  get(id: string): Promise<TemplateMigration> {
    return api
      .get<ApiResponse<TemplateMigration>>(`/template-migrations/${id}`)
      .then((r) => r.data.data);
  },

  resolve(
    id: string,
    input: ResolveTemplateMigrationInput,
  ): Promise<{ migration: TemplateMigration; template: Template }> {
    return api
      .post<ApiResponse<{ migration: TemplateMigration; template: Template }>>(
        `/template-migrations/${id}/resolve`,
        input,
      )
      .then((r) => r.data.data);
  },
};
