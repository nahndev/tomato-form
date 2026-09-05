"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTemplates } from "@/features/template/hooks/useTemplates";

export interface AddTemplateButtonProps {
  linkedTemplateIds: string[];
  onAdd: (templateId: string) => void;
}

const AddTemplateButton: React.FC<AddTemplateButtonProps> = ({
  linkedTemplateIds,
  onAdd,
}) => {
  const { data: allTemplates = [], isLoading } = useTemplates();
  const availableTemplates = allTemplates.filter(
    (t) => !linkedTemplateIds.includes(t.id),
  );

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
