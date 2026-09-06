import type { DisplayValueProps } from "@/features/board/components/submission/display/types";

const TextValue: React.FC<DisplayValueProps> = ({ displayValue }) => {
  const text = displayValue?.text;
  const entity = displayValue?.entity;
  const value =
    typeof text === "string" && text.length > 0
      ? text
      : Array.isArray(entity) && entity.length > 0
        ? entity.join(", ")
        : null;

  return <span className="truncate">{value ?? "—"}</span>;
};

export default TextValue;
