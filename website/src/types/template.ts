export type WidgetType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "checkbox"
  | "session";

export interface Widget {
  id: string;
  type: WidgetType;
}

export interface GridLayout {
  column: number;
  span: number;
  idx: string;
  isStatic?: boolean;
  isFullWidth?: boolean;
}

export interface WidgetProperties {
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface Session {
  id: string;
  name: string;
}

export interface SessionLayout {
  layouts: Record<string, GridLayout>;
  height: number;
}

export interface Template {
  id: string;
  name: string;
  widgets: Record<string, Widget>;
  properties: Record<string, WidgetProperties>;
  sessions: Record<string, Session>;
  layout: Record<string, SessionLayout>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTemplateInput {
  name: string;
  widgets?: Record<string, Widget>;
  properties?: Record<string, WidgetProperties>;
  sessions?: Record<string, Session>;
  layout?: Record<string, SessionLayout>;
}

export type UpdateTemplateInput = Partial<CreateTemplateInput>;
