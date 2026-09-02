import type { Document } from "@/types/document";
import axios from "axios";

const api = axios.create({
  baseURL: "/api/storage",
});

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const documentApi = {
  list(): Promise<Document[]> {
    return api.get<ApiResponse<Document[]>>("/files").then((r) => r.data.data);
  },

  get(id: string): Promise<Document> {
    return api.get<ApiResponse<Document>>(`/files/${id}`).then((r) => r.data.data);
  },

  upload(file: File): Promise<Document> {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<ApiResponse<Document>>("/files", formData).then((r) => r.data.data);
  },

  remove(id: string): Promise<void> {
    return api.delete(`/files/${id}`).then(() => undefined);
  },
};
