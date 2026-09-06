import type { Recipient } from "@/types/button-action";
import type { SubmissionDisplayDoc } from "@/types/submission-display";

export interface Submission {
  id: string;
  boardId: string;
  templateVersionId: string;
  data: Record<string, unknown>;
  dataDisplays: SubmissionDisplayDoc;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubmissionInput {
  boardId: string;
  templateVersionId: string;
  data?: Record<string, unknown>;
}

export interface UpdateSubmissionInput {
  data?: Record<string, unknown>;
}

export interface SendMailInput {
  recipients: Recipient[];
  subject: string;
  body: string;
}
