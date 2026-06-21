export enum JobStatus {
  IDLE = "idle",
  RUNNING = "running",
  SUCCESS = "success",
  FAILED = "failed",
}

export enum JobExecutionStatus {
  RUNNING = "running",
  SUCCESS = "success",
  FAILED = "failed",
}

export const ACTION_TYPE_SUBMISSION_CREATION = "SUBMISSION_CREATION" as const;

export interface SubmissionCreationAction {
  type: typeof ACTION_TYPE_SUBMISSION_CREATION;
  templateId: string;
  boardId: string;
}

export interface Job {
  id: string;
  name: string;
  cronExpression: string;
  actions: SubmissionCreationAction[];
  enabled: boolean;
  status: JobStatus;
  lastRunAt?: string | null;
  nextRunAt?: string | null;
  lastError?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateJobInput {
  name: string;
  cronExpression: string;
  enabled?: boolean;
  actions: SubmissionCreationAction[];
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
