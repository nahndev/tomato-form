import { Input } from "@/components/ui/input";

export interface BoardColumnSizeInputProps {
  size: number | null;
  onChange: (size: number) => void;
}

const BoardColumnSizeInput: React.FC<BoardColumnSizeInputProps> = ({
  size,
  onChange,
}) => {
  return (
    <Input
      type="number"
      min={1}
      value={size ?? ""}
      placeholder="Size"
      aria-label="Column size"
      onChange={(e) => onChange(Number(e.target.value))}
      className="min-w-[150px]"
    />
  );
};

export default BoardColumnSizeInput;
