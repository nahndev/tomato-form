"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DISPLAY_TYPE_LIST } from "@/features/template/constants/widget";
import { DisplayType } from "@/types/display-type";

const SELECTABLE_DISPLAY_TYPES = DISPLAY_TYPE_LIST.filter(
  (definition) => definition.type !== DisplayType.UNKNOWN,
);

export interface ColumnDisplayTypeSelectProps {
  value: DisplayType | null;
  allowedTypes: DisplayType[] | null;
  onChange: (type: DisplayType) => void;
}

/**
 * Independent display-type picker for a column. `allowedTypes` narrows the
 * options to what the column's currently selected widgets can share, but the
 * chosen value no longer feeds back into filtering those widget selects.
 */
const ColumnDisplayTypeSelect: React.FC<ColumnDisplayTypeSelectProps> = ({
  value,
  allowedTypes,
  onChange,
}) => {
  const options = allowedTypes
    ? SELECTABLE_DISPLAY_TYPES.filter((definition) =>
        allowedTypes.includes(definition.type),
      )
    : SELECTABLE_DISPLAY_TYPES;

  return (
    <Select
      value={value ?? undefined}
      onValueChange={(type) => onChange(type as DisplayType)}
      disabled={options.length === 0}
    >
      <SelectTrigger aria-label="Column display type" className="text-xs">
        <SelectValue placeholder="Auto" />
      </SelectTrigger>
      <SelectContent>
        {options.map((definition) => (
          <SelectItem key={definition.type} value={definition.type}>
            {definition.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ColumnDisplayTypeSelect;
