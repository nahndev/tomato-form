"use client";

import { useEffect } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useBoard } from "@/hooks/useBoards";
import {
  useDeleteJob,
  useJob,
  useJobExecutions,
  useUpdateJob,
} from "@/features/job/hooks/useJobs";
import { useTemplate } from "@/hooks/useTemplates";
import { useUserStore } from "@/store/user.store";
import JobForm, { JobFormValues } from "@/features/job/components/JobForm";
import {
  ACTION_TYPE_SEND_MAIL,
  JobAction,
  JobExecutionStatus,
  Recipient,
  RecipientType,
  SendMailAction,
  SubmissionCreationAction,
} from "@/types/job";

enum JobDetailTab {
  SETUP = "setup",
  STATUS = "status",
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
        Step {index + 1}: {ACTION_LABEL[action.type]}
      </div>
      {action.type === ACTION_TYPE_SEND_MAIL ? (
        <SendMailActionSummary action={action} />
      ) : (
        <SubmissionCreationActionSummary action={action} />
      )}
    </div>
  );
}

export type JobDetailPageProps = {
  boardId: string;
  jobId: string;
  mode: "view" | "edit";
};

const JobDetailPage: React.FC<JobDetailPageProps> = ({
  boardId,
  jobId,
  mode,
}) => {
  const router = useRouter();

  const { data: job, isLoading, isError } = useJob(jobId);
  const { data: executions = [], isLoading: isLoadingExecutions } =
    useJobExecutions(jobId);
  const { mutateAsync: updateJob } = useUpdateJob(jobId);
  const { mutateAsync: deleteJob, isPending: isDeleting } =
    useDeleteJob(boardId);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !job) notFound();

  async function handleUpdate(values: JobFormValues) {
    try {
      await updateJob({
        name: values.name,
        expression: values.expression,
        actions: values.actions,
      });
      toast.success("Job updated");
      router.push(`/boards/${boardId}/jobs/${jobId}?mode=view`);
    } catch (err) {
      console.error("Failed to update job:", err);
      toast.error("Failed to update job");
    }
  }

  async function handleDelete() {
    try {
      await deleteJob(jobId);
      toast.success("Job deleted");
      router.push(`/boards/${boardId}`);
    } catch (err) {
      console.error("Failed to delete job:", err);
      toast.error("Failed to delete job");
    }
  }

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
        <div className="flex items-center gap-2">
          <Badge variant={job.enable ? "default" : "secondary"}>
            {job.enable ? "Enabled" : "Disabled"}
          </Badge>
          {mode === "view" && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/boards/${boardId}/jobs/${jobId}?mode=edit`}>
                  <Pencil className="size-3.5" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue={JobDetailTab.SETUP}>
        <TabsList className="w-full">
          <TabsTrigger value={JobDetailTab.SETUP}>Setup</TabsTrigger>
          <TabsTrigger value={JobDetailTab.STATUS}>Status</TabsTrigger>
        </TabsList>

        <TabsContent value={JobDetailTab.SETUP}>
          {mode === "edit" ? (
            <JobForm
              boardId={boardId}
              initialValues={{
                name: job.name,
                expression: job.expression,
                actions: job.actions,
              }}
              submitLabel="Save Changes"
              submittingLabel="Saving…"
              onSubmit={handleUpdate}
              onCancel={() =>
                router.push(`/boards/${boardId}/jobs/${jobId}?mode=view`)
              }
            />
          ) : (
            <div className="flex flex-col gap-3 py-4">
              {job.actions.map((action, index) => (
                <JobActionSummary key={index} index={index} action={action} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value={JobDetailTab.STATUS}>
          <div className="py-4">
            {isLoadingExecutions ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : executions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No executions yet.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {executions.map((execution) => (
                  <div
                    key={execution.id}
                    className="flex flex-col gap-1 rounded-lg border border-border p-3 text-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant={EXECUTION_STATUS_VARIANT[execution.status]}
                      >
                        {execution.status}
                      </Badge>
                      <span className="text-muted-foreground">
                        {new Date(execution.startedAt).toLocaleString()}
                      </span>
                    </div>
                    {execution.error && (
                      <div className="text-destructive">
                        {execution.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobDetailPage;
