/**
 * RabbitMQ fire-and-forget event contract for submission value sync, shared
 * (by manual duplication, same convention as `template-migration/template-migration.contract.ts`)
 * with `yjs-server/src/collaboration/submission-value.contract.ts`. Keep both in sync.
 *
 * Flow: whenever hocuspocus stores a `submission/{id}/default` doc,
 * `yjs-server`'s `SubmissionStrategy` emits `SUBMISSION_VALUES_CHANGED_EVENT`
 * onto `server_queue` with each widget's current value and the Yjs item
 * clock that last set it. `server` merges values into `Submission.data`,
 * only applying a key when its clock is newer than the last one it
 * applied (tracked in `Submission.dataClocks`) - dropping stale,
 * out-of-order deliveries.
 */
export const SUBMISSION_VALUES_CHANGED_EVENT = "submission.values-changed";

export interface SubmissionValueEntry {
  value: unknown;
  clock: number;
}

export interface SubmissionValuesChangedEvent {
  submissionId: string;
  values: Record<string, SubmissionValueEntry>;
}
