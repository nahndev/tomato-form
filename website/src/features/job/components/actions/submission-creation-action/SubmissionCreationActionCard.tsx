"use client";

import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useBoards } from "@/hooks/useBoards";
import { useTemplates } from "@/hooks/useTemplates";
import { SubmissionCreationAction } from "@/types/job";

export type SubmissionCreationActionCardProps = {
  idPrefix: string;
  value: SubmissionCreationAction;
  onChange: (patch: Partial<Omit<SubmissionCreationAction, "type">>) => void;
  errors?: Partial<Record<"templateId" | "boardId", string>>;
};

const SubmissionCreationActionCard: React.FC<
  SubmissionCreationActionCardProps
> = ({ idPrefix, value, onChange, errors }) => {
  const { data: boards = [] } = useBoards();
  const { data: templates = [] } = useTemplates();

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-board`}>Board</Label>
        <Select
          id={`${idPrefix}-board`}
          value={value.boardId}
          onChange={(e) => onChange({ boardId: e.target.value })}
          error={errors?.boardId}
        >
          <option value="">Select a board…</option>
          {boards.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-template`}>Template</Label>
        <Select
          id={`${idPrefix}-template`}
          value={value.templateId}
          onChange={(e) => onChange({ templateId: e.target.value })}
          error={errors?.templateId}
        >
          <option value="">Select a template…</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </Select>
      </div>
    </>
  );
};

export default SubmissionCreationActionCard;
