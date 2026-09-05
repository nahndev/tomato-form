import type { ColumnSize } from "@/types/board";

export interface ColumnSizeOption {
  size: ColumnSize;
  label: string;
}

const WIDTH_STEPS = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200];
const FLEX_STEPS = [1, 2, 3, 4, 5];

export const COLUMN_SIZE_OPTIONS: ColumnSizeOption[] = [
  ...WIDTH_STEPS.map((width) => ({ size: { width }, label: `${width}px` })),
  ...FLEX_STEPS.map((flex) => ({ size: { flex }, label: `${flex}fr` })),
];

/** Native <select> options only carry strings, so ColumnSize is encoded/decoded around them. */
export function encodeColumnSize(size: ColumnSize): string {
  return "flex" in size ? `flex:${size.flex}` : `width:${size.width}`;
}

export function decodeColumnSize(encoded: string): ColumnSize {
  const [kind, raw] = encoded.split(":");
  const value = Number(raw);
  return kind === "flex" ? { flex: value } : { width: value };
}
