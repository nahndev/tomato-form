import type { DisplayValueProps } from "@/features/board/components/submission/display/types";
import { parseLabelDisplayValue } from "@/features/board/utils/submissionDisplayValue";

const TextValue: React.FC<DisplayValueProps> = ({ displayValue }) => {
  const value = parseLabelDisplayValue(displayValue);

  return <span className="truncate">{value ?? "—"}</span>;
};

export default TextValue;
