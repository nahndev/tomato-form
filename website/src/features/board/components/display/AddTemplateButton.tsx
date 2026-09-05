import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Template } from "@/types/template";

export interface AddTemplateButtonProps {
  availableTemplates: Template[];
  isLoading: boolean;
  onAdd: (templateId: string) => void;
}

const AddTemplateButton: React.FC<AddTemplateButtonProps> = ({
  availableTemplates,
  isLoading,
  onAdd,
}) => {
  if (isLoading) {
    return (
      <span className="text-xs text-muted-foreground">Loading templates…</span>
    );
  }

  if (availableTemplates.length === 0) {
    return (
      <span className="text-xs text-muted-foreground">
        All templates linked
      </span>
    );
  }

  return (
    <Select value="" onValueChange={(value) => onAdd(value)}>
      <SelectTrigger aria-label="Add template" className="w-40">
        <SelectValue placeholder="+ Add template" />
      </SelectTrigger>
      <SelectContent>
        {availableTemplates.map((t) => (
          <SelectItem key={t.id} value={t.id}>
            {t.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AddTemplateButton;
