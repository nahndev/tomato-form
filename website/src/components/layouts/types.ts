export type MainAxisAlignment =
  | "start"
  | "end"
  | "center"
  | "spaceBetween"
  | "spaceAround"
  | "spaceEvenly";

export type CrossAxisAlignment =
  | "start"
  | "end"
  | "center"
  | "stretch"
  | "baseline";

export type MainAxisSize = "min" | "max";

export type Alignment =
  | "topLeft"
  | "topCenter"
  | "topRight"
  | "centerLeft"
  | "center"
  | "centerRight"
  | "bottomLeft"
  | "bottomCenter"
  | "bottomRight";

export type EdgeInsetsValue =
  | number
  | { horizontal?: number; vertical?: number }
  | { top?: number; right?: number; bottom?: number; left?: number };

export interface BoxDecoration {
  color?: string;
  borderRadius?: number | string;
  border?: string;
  boxShadow?: string;
}

export interface BoxConstraints {
  minWidth?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
}
