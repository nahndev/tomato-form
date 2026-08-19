export interface Widget {
  id: string;
  type: string;
}

export interface GridLayout {
  column: number;
  span: number;
  idx: number;
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
}

export interface SessionProperties {
  name: string;
  icon?: string;
  description?: unknown;
}

/** Shape of `TemplateVersion.snapshot` - everything loaded from the yjs doc at publish time. */
export interface TemplateVersionSnapshot {
  widgets: Record<string, Widget>;
  layouts: Record<string, GridLayout>;
  widgetToSession: Record<string, string>;
  properties: Record<string, WidgetProperties>;
  sessions: Record<string, Session>;
  sessionProperties: Record<string, SessionProperties>;
}
