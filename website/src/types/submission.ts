import type { Recipient } from "@/types/button-action";

export interface Submission {
  id: string;
  boardId: string;
  templateId: string;
  data: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubmissionInput {
  boardId: string;
  templateId: string;
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
