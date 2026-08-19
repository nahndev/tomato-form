"use client";

import { useCurrentSubmission } from "@/features/submission/components/provider/SubmissionProvider";
import { useSubmissionActions } from "@/features/submission/hooks/actions/useSubmissionActions";
import { useCurrentSessionId } from "@/features/submission/hooks/state/useCurrentSessionId";
import { useVisibleSessions } from "@/features/submission/hooks/state/useVisibleSessions";
import {
  ButtonActionProvider,
  type RunButtonAction,
} from "@/features/template/components/widget/ButtonActionContext";
import { useTemplateState } from "@/features/template/hooks/state/useTemplateState";
import { submissionApi } from "@/services/submission.api";
import { ButtonActionType } from "@/types/button-action";
import { toast } from "sonner";

export interface SubmissionButtonActionProviderProps {
  children: React.ReactNode;
}

/**
 * Real implementation of `ButtonActionContext` for the fill wizard: sends
 * mail for real, and drives session navigation off the submission's own
 * yjs `meta.currentSessionId` (see `useSubmissionActions`/`useCurrentSessionId`).
 */
export const SubmissionButtonActionProvider: React.FC<
  SubmissionButtonActionProviderProps
> = ({ children }) => {
  const submission = useCurrentSubmission();
  const { widgetToSession } = useTemplateState();
  const sessionList = useVisibleSessions();
  const currentSessionId = useCurrentSessionId();
  const { goToSession, resetValues } = useSubmissionActions();

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

      case ButtonActionType.SUBMIT: {
        const currentIndex = sessionList.findIndex((s) => s.id === currentSessionId);
        const next =
          action.toSessionId ?? sessionList[currentIndex + 1]?.id;
        if (next) goToSession(next);
        return;
      }

      case ButtonActionType.RETURN: {
        const currentIndex = sessionList.findIndex((s) => s.id === currentSessionId);
        const previous = sessionList[currentIndex - 1]?.id;
        if (previous) goToSession(previous);
        return;
      }

      case ButtonActionType.RESET: {
        if (!currentSessionId) return;
        const widgetIds = Object.entries(widgetToSession)
          .filter(([, sessionId]) => sessionId === currentSessionId)
          .map(([widgetId]) => widgetId);
        resetValues(widgetIds);
        return;
      }
    }
  };

  return <ButtonActionProvider value={runAction}>{children}</ButtonActionProvider>;
};
