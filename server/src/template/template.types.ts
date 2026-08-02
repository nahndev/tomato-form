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
