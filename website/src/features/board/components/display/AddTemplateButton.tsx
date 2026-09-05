import { Select } from "@/components/ui/select";
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
    <Select
      value=""
      onChange={(e) => {
        if (e.target.value) onAdd(e.target.value);
      }}
      className="w-40"
      aria-label="Add template"
    >
      <option value="">+ Add template</option>
      {availableTemplates.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </Select>
  );
};

export default AddTemplateButton;
