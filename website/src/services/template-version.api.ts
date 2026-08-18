import type { TemplateVersion } from "@/types/template";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3029/api",
});

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const templateVersionApi = {
  get(id: string): Promise<TemplateVersion> {
    return api
      .get<ApiResponse<TemplateVersion>>(`/template-versions/${id}`)
      .then((r) => r.data.data);
  },
};
