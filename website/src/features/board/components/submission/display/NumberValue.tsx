import type { DisplayValueProps } from "@/features/board/components/submission/display/types";

/** No "number" bucket exists in `SubmissionDisplayDoc` yet - numeric widgets are only backfilled under `text` - so this parses that. */
const NumberValue: React.FC<DisplayValueProps> = ({ displayValue }) => {
  const text = displayValue?.text;
  const parsed = typeof text === "string" && text.length > 0 ? Number(text) : NaN;
  const value = Number.isNaN(parsed) ? null : parsed.toLocaleString();

  return <span className="truncate">{value ?? "—"}</span>;
};

export default NumberValue;
