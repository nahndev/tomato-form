export type WidgetType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "checkbox";

export interface Widget {
  id: string;
  type: WidgetType;
}

export interface Layout {
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface WidgetProperties {
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface Template {
  id: string;
  name: string;
  widgets: Record<string, Widget>;
  layouts: Record<string, Layout>;
  properties: Record<string, WidgetProperties>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTemplateInput {
  name: string;
  widgets?: Record<string, Widget>;
  layouts?: Record<string, Layout>;
  properties?: Record<string, WidgetProperties>;
}

export type UpdateTemplateInput = Partial<CreateTemplateInput>;
