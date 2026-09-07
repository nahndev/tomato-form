export interface WidgetProperties {
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface Widget extends WidgetProperties {
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

export interface SessionProperties {
  name: string;
  icon?: string;
  description?: unknown;
}

export interface Session extends SessionProperties {
  id: string;
}

/** Shape of `Template.snapshot` - everything loaded from the yjs doc at publish time. */
export interface TemplateSnapshot {
  widgets: Record<string, Widget>;
  layouts: Record<string, GridLayout>;
  widgetToSession: Record<string, string>;
  sessions: Record<string, Session>;
}
