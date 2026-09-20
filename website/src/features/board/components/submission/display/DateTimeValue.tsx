import type { DisplayValueProps } from "@/features/board/components/submission/display/types";

const DateTimeValue: React.FC<DisplayValueProps> = ({ displayValue }) => {
  const timestamp = displayValue?.date;
  const value =
    typeof timestamp === "number" ? new Date(timestamp).toLocaleString() : null;

  return <span className="truncate">{value ?? "—"}</span>;
};

export default DateTimeValue;
