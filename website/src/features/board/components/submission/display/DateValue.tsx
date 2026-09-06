import type { DisplayValueProps } from "@/features/board/components/submission/display/types";

const DateValue: React.FC<DisplayValueProps> = ({ displayValue }) => {
  const timestamp = displayValue?.date;
  const value =
    typeof timestamp === "number" ? new Date(timestamp).toLocaleDateString() : null;

  return <span className="truncate">{value ?? "—"}</span>;
};

export default DateValue;
