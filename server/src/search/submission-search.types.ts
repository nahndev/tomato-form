/** See TASK.md "Tasks 03 - Mapping to SubmissionSearchDoc" for the field format this mirrors. */
export interface SubmissionSearchDateEntry {
  key: string;
  value: number;
}

export interface SubmissionSearchTextEntry {
  key: string;
  value: string;
}

export interface SubmissionSearchDoc {
  id: string;
  tags: string[];
  date: SubmissionSearchDateEntry[];
  text: SubmissionSearchTextEntry[];
}
