import { Input } from "@/components/ui/input";

export interface BoardLabelInputProps {
  label: string | null;
  onChange: (label: string) => void;
}

const BoardLabelInput: React.FC<BoardLabelInputProps> = ({
  label,
  onChange,
}) => {
  return (
    <Input
      type="text"
      value={label ?? ""}
      placeholder="Label"
      aria-label="Column label"
      onChange={(e) => onChange(e.target.value)}
      className="min-w-[150px]"
    />
  );
};

export default BoardLabelInput;
