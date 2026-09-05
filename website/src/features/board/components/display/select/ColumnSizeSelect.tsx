"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COLUMN_SIZE_OPTIONS,
  decodeColumnSize,
  encodeColumnSize,
} from "@/features/board/constants/column/sizeOptions";
import type { ColumnSize } from "@/types/board";

export interface ColumnSizeSelectProps {
  size: ColumnSize | null;
  onChange: (size: ColumnSize) => void;
}

const ColumnSizeSelect: React.FC<ColumnSizeSelectProps> = ({
  size,
  onChange,
}) => (
  <Select
    value={size ? encodeColumnSize(size) : ""}
    onValueChange={(value) => onChange(decodeColumnSize(value))}
  >
    <SelectTrigger aria-label="Column size" className="text-xs">
      <SelectValue placeholder="Size" />
    </SelectTrigger>
    <SelectContent>
      {COLUMN_SIZE_OPTIONS.map((option) => {
        const value = encodeColumnSize(option.size);
        return (
          <SelectItem key={value} value={value}>
            {option.label}
          </SelectItem>
        );
      })}
    </SelectContent>
  </Select>
);

export default ColumnSizeSelect;
