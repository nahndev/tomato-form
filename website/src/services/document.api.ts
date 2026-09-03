import type { AccessToken, ResourceItem, ResourceType } from "@/types/document";
import axios from "axios";

const api = axios.create({
  baseURL: "/api/storage",
});

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const resourceApi = {
  list(parentId?: string | null, type?: ResourceType): Promise<ResourceItem[]> {
    return api
      .get<ApiResponse<ResourceItem[]>>("/resources", { params: { parentId: parentId ?? undefined, type } })
      .then((r) => r.data.data);
  },

  get(id: string): Promise<ResourceItem> {
    return api.get<ApiResponse<ResourceItem>>(`/resources/${id}`).then((r) => r.data.data);
  },

  createFolder(name: string, parentId?: string | null): Promise<ResourceItem> {
    return api
      .post<ApiResponse<ResourceItem>>("/resources/folders", { name, parentId: parentId ?? undefined })
      .then((r) => r.data.data);
  },

  upload(file: File, parentId?: string | null): Promise<ResourceItem> {
    const formData = new FormData();
    formData.append("file", file);
    if (parentId) formData.append("parentId", parentId);
    return api.post<ApiResponse<ResourceItem>>("/resources", formData).then((r) => r.data.data);
  },

  move(id: string, parentId?: string | null): Promise<ResourceItem> {
    return api
      .patch<ApiResponse<ResourceItem>>(`/resources/${id}/move`, { parentId: parentId ?? null })
      .then((r) => r.data.data);
  },

  remove(id: string): Promise<void> {
    return api.delete(`/resources/${id}`).then(() => undefined);
  },
};

export const accessTokenApi = {
  issue(folderId: string): Promise<AccessToken> {
    return api.post<ApiResponse<AccessToken>>("/access-tokens", { folderId }).then((r) => r.data.data);
  },
};
