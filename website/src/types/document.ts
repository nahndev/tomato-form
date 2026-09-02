export type ResourceType = "FILE" | "FOLDER";

export interface ResourceItem {
  id: string;
  type: ResourceType;
  name: string;
  slug: string;
  parentId: string | null;
  url?: string;
  mimeType?: string;
  size?: number;
  createdAt: string;
  updatedAt: string;
}
