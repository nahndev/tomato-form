export type WidgetType =
  | "text"
  | "text-area"
  | "number"
  | "date"
  | "datetime"
  | "time"
  | "select"
  | "checkbox"
  | "radio"
  | "label"
  | "signature"
  | "button"
  | "image-uploader"
  | "file-uploader"
  | "break"
  | "session";

export enum TemplateMode {
  VIEW = "view",
  EDIT = "edit",
}

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
  /** Static display text for the `label` widget. */
  content?: string;
  /** Target URL the `button` widget opens on click. */
  url?: string;
}

export interface Session {
  id: string;
  name: string;
}

export interface Template {
  id: string;
  name: string;
  widgets: Record<string, Widget>;
  properties: Record<string, WidgetProperties>;
  sessions: Record<string, Session>;
  layouts: Record<string, GridLayout>;
  widgetToSession: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTemplateInput {
  name: string;
  widgets?: Record<string, Widget>;
  properties?: Record<string, WidgetProperties>;
  sessions?: Record<string, Session>;
  layouts?: Record<string, GridLayout>;
  widgetToSession?: Record<string, string>;
}

export type UpdateTemplateInput = Partial<CreateTemplateInput>;
