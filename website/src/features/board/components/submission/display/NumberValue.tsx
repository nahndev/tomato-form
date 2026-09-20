import type { DisplayValueProps } from "@/features/board/components/submission/display/types";
import { parseNumberDisplayValue } from "@/features/board/utils/submissionDisplayValue";

const NumberValue: React.FC<DisplayValueProps> = ({ displayValue }) => {
  const parsed = parseNumberDisplayValue(displayValue);

  return <span className="truncate">{parsed !== null ? parsed.toLocaleString() : "—"}</span>;
};

export default NumberValue;
