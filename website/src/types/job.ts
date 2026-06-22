export enum JobExecutionStatus {
  RUNNING = "running",
  SUCCESS = "success",
  FAILED = "failed",
}

export const ACTION_TYPE_SUBMISSION_CREATION = "SUBMISSION_CREATION" as const;
export const ACTION_TYPE_SEND_MAIL = "SEND_MAIL" as const;

export interface SubmissionCreationAction {
  type: typeof ACTION_TYPE_SUBMISSION_CREATION;
  templateId: string;
  boardId: string;
}

export enum RecipientType {
  MAIL = "mail",
  USER = "user",
}

export interface Recipient {
  type: RecipientType;
  value: string;
}

export interface MailContent {
  subject: string;
  body: string;
}

export interface SendMailAction {
  type: typeof ACTION_TYPE_SEND_MAIL;
  recipients: Recipient[];
  content: MailContent;
}

export type JobAction = SubmissionCreationAction | SendMailAction;

export interface Job {
  id: string;
  name: string;
  expression: string;
  actions: JobAction[];
  enable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateJobInput {
  name: string;
  expression: string;
  enable?: boolean;
  actions: JobAction[];
}

export type UpdateJobInput = Partial<CreateJobInput>;

export interface JobExecution {
  id: string;
  jobId: string;
  status: JobExecutionStatus;
  startedAt: string;
  finishedAt?: string | null;
  error?: string | null;
  result?: Record<string, unknown> | null;
}
