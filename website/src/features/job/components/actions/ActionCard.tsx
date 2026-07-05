"use client";

import {
  ACTION_TYPE_SEND_MAIL,
  JobAction,
  SendMailAction,
  SubmissionCreationAction,
} from "@/types/job";
import SendMailActionCard, {
  SendMailActionErrors,
} from "./send-mail-action/SendMailActionCard";
import SubmissionCreationActionCard from "./submission-creation-action/SubmissionCreationActionCard";

export type JobActionPatch = Partial<Omit<SubmissionCreationAction, "type">> &
  Partial<Omit<SendMailAction, "type">>;

export type ActionCardErrors =
  | Partial<Record<"templateId" | "boardId", string>>
  | SendMailActionErrors;

export type ActionCardProps = {
  idPrefix: string;
  value: JobAction;
  onChange: (patch: JobActionPatch) => void;
  errors?: ActionCardErrors;
};

const ActionCard: React.FC<ActionCardProps> = ({
  idPrefix,
  value,
  onChange,
  errors,
}) => {
  if (value.type === ACTION_TYPE_SEND_MAIL) {
    return (
      <SendMailActionCard
        idPrefix={idPrefix}
        value={value}
        onChange={onChange}
        errors={errors as SendMailActionErrors | undefined}
      />
    );
  }

  return (
    <SubmissionCreationActionCard
      idPrefix={idPrefix}
      value={value}
      onChange={onChange}
      errors={
        errors as Partial<Record<"templateId" | "boardId", string>> | undefined
      }
    />
  );
};

export default ActionCard;
