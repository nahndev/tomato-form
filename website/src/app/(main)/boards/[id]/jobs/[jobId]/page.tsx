"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useBoard } from "@/hooks/useBoards";
import { useJob, useJobExecutions } from "@/hooks/useJobs";
import { useTemplate } from "@/hooks/useTemplates";
import { useUserStore } from "@/store/user.store";
import {
  ACTION_TYPE_SEND_MAIL,
  JobAction,
  JobExecutionStatus,
  Recipient,
  RecipientType,
  SendMailAction,
  SubmissionCreationAction,
} from "@/types/job";

interface PageProps {
  params: Promise<{ id: string; jobId: string }>;
}

const EXECUTION_STATUS_VARIANT: Record<
  JobExecutionStatus,
  "secondary" | "default" | "destructive"
> = {
  [JobExecutionStatus.RUNNING]: "secondary",
  [JobExecutionStatus.SUCCESS]: "default",
  [JobExecutionStatus.FAILED]: "destructive",
};

const ACTION_LABEL: Record<JobAction["type"], string> = {
  SUBMISSION_CREATION: "Create submission",
  SEND_MAIL: "Send mail",
};

function SubmissionCreationActionSummary({
  action,
}: {
  action: SubmissionCreationAction;
}) {
  const { data: board } = useBoard(action.boardId);
  const { data: template } = useTemplate(action.templateId);

  return (
    <>
      <div>
        <div className="text-muted-foreground">Board</div>
        <div>{board?.name ?? "—"}</div>
      </div>
      <div>
        <div className="text-muted-foreground">Template</div>
        <div>{template?.name ?? "—"}</div>
      </div>
    </>
  );
}

function SendMailActionSummary({ action }: { action: SendMailAction }) {
  const users = useUserStore((s) => s.users);
  const initUsers = useUserStore((s) => s.init);

  useEffect(() => {
    initUsers();
  }, [initUsers]);

  function recipientLabel(recipient: Recipient) {
    if (recipient.type === RecipientType.USER) {
      return (
        users.find((u) => u.uuid === recipient.value)?.name ?? recipient.value
      );
    }
    return recipient.value;
  }

  return (
    <>
      <div className="col-span-2">
        <div className="text-muted-foreground">Subject</div>
        <div>{action.content.subject}</div>
      </div>
      <div className="col-span-2">
        <div className="text-muted-foreground">Recipients</div>
        <div>{action.recipients.map(recipientLabel).join(", ")}</div>
      </div>
    </>
  );
}

function JobActionSummary({
  index,
  action,
}: {
  index: number;
  action: JobAction;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-lg border border-border p-4 text-sm">
      <div className="col-span-2 text-xs font-medium text-muted-foreground">
        Action {index + 1}: {ACTION_LABEL[action.type]}
      </div>
      {action.type === ACTION_TYPE_SEND_MAIL ? (
        <SendMailActionSummary action={action} />
      ) : (
        <SubmissionCreationActionSummary action={action} />
      )}
    </div>
  );
}

export default function JobDetailPage({ params }: PageProps) {
  const { id: boardId, jobId } = use(params);

  const { data: job, isLoading, isError } = useJob(jobId);
  const { data: executions = [], isLoading: isLoadingExecutions } =
    useJobExecutions(jobId);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !job) notFound();

  return (
    <div className="container mx-auto max-w-2xl px-6 py-10">
      <Link
        href={`/boards/${boardId}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Board
      </Link>

      <div className="mb-6 flex items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">{job.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {job.expression}
          </p>
        </div>
        <Badge variant={job.enable ? "default" : "secondary"}>
          {job.enable ? "Enabled" : "Disabled"}
        </Badge>
      </div>

      <h2 className="mb-3 text-lg font-semibold">Actions</h2>
      <div className="mb-8 flex flex-col gap-3">
        {job.actions.map((action, index) => (
          <JobActionSummary key={index} index={index} action={action} />
        ))}
      </div>

      <h2 className="mb-3 text-lg font-semibold">Execution History</h2>

      {isLoadingExecutions ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : executions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No executions yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {executions.map((execution) => (
            <div
              key={execution.id}
              className="flex flex-col gap-1 rounded-lg border border-border p-3 text-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <Badge variant={EXECUTION_STATUS_VARIANT[execution.status]}>
                  {execution.status}
                </Badge>
                <span className="text-muted-foreground">
                  {new Date(execution.startedAt).toLocaleString()}
                </span>
              </div>
              {execution.error && (
                <div className="text-destructive">{execution.error}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
