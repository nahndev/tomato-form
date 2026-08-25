"use client";

import { useCurrentSubmission } from "@/features/submission/components/provider/SubmissionProvider";
import {
  ButtonActionProvider,
  type RunButtonAction,
} from "@/features/template/components/widget/ButtonActionContext";
import { submissionApi } from "@/services/submission.api";
import { ButtonActionType } from "@/types/button-action";
import { toast } from "@/components/ui/sonner";

export interface SubmissionButtonActionProviderProps {
  children: React.ReactNode;
}

/** Real implementation of `ButtonActionContext` for the fill wizard: sends mail for real. */
export const SubmissionButtonActionProvider: React.FC<
  SubmissionButtonActionProviderProps
> = ({ children }) => {
  const submission = useCurrentSubmission();

  const runAction: RunButtonAction = async (action) => {
    switch (action.type) {
      case ButtonActionType.LINK: {
        window.open(action.url, "_blank", "noopener,noreferrer");
        return;
      }

      case ButtonActionType.MAIL: {
        try {
          await submissionApi.sendMail(submission.id, {
            recipients: action.recipients,
            subject: action.subject,
            body: action.body,
          });
          toast.success("Mail sent");
        } catch (err) {
          console.error("Failed to send mail:", err);
          toast.error("Failed to send mail");
        }
        return;
      }
    }
  };

  return <ButtonActionProvider value={runAction}>{children}</ButtonActionProvider>;
};
