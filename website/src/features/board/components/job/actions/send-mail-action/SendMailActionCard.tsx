"use client";

import { SendMailAction } from "@/types/job";
import ContentEditor, { ContentEditorProps } from "./ContentEditor";
import RecipientEditor, { RecipientEditorErrors } from "./RecipientEditor";

export type SendMailActionErrors = {
  recipients?: RecipientEditorErrors;
  content?: ContentEditorProps["errors"];
};

export type SendMailActionCardProps = {
  idPrefix: string;
  value: SendMailAction;
  onChange: (patch: Partial<Omit<SendMailAction, "type">>) => void;
  errors?: SendMailActionErrors;
};

const SendMailActionCard: React.FC<SendMailActionCardProps> = ({
  idPrefix,
  value,
  onChange,
  errors,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <RecipientEditor
        idPrefix={idPrefix}
        recipients={value.recipients}
        onChange={(recipients) => onChange({ recipients })}
        errors={errors?.recipients}
      />
      <ContentEditor
        idPrefix={idPrefix}
        content={value.content}
        onChange={(content) => onChange({ content })}
        errors={errors?.content}
      />
    </div>
  );
};

export default SendMailActionCard;
