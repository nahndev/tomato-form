import {
  ACTION_TYPE_SEND_MAIL,
  ACTION_TYPE_SUBMISSION_CREATION,
  JobAction,
  RecipientType,
} from "@/types/job";

export const ACTION_TYPE_OPTIONS = [
  { value: ACTION_TYPE_SUBMISSION_CREATION, label: "Create submission" },
  { value: ACTION_TYPE_SEND_MAIL, label: "Send mail" },
] as const;

export function createDefaultAction(
  type: JobAction["type"],
  defaultBoardId: string,
): JobAction {
  if (type === ACTION_TYPE_SEND_MAIL) {
    return {
      type: ACTION_TYPE_SEND_MAIL,
      recipients: [{ type: RecipientType.MAIL, value: "" }],
      content: { subject: "", body: "" },
    };
  }

  return {
    type: ACTION_TYPE_SUBMISSION_CREATION,
    templateId: "",
    boardId: defaultBoardId,
  };
}
