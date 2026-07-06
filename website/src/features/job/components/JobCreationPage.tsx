"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import JobForm, { JobFormValues } from "@/features/job/components/JobForm";
import { createDefaultAction } from "@/features/job/components/actions/create-default-action";
import { useCreateJob } from "@/features/job/hooks/useJobs";
import { ACTION_TYPE_SUBMISSION_CREATION } from "@/types/job";

export type JobCreationPageProps = {
  boardId: string;
};

const JobCreationPage: React.FC<JobCreationPageProps> = ({ boardId }) => {
  const router = useRouter();
  const { mutateAsync: createJob } = useCreateJob(boardId);

  async function handleSubmit(values: JobFormValues) {
    try {
      const job = await createJob({
        name: values.name,
        expression: values.expression,
        enable: true,
        actions: values.actions,
      });
      toast.success("Job created");
      router.push(`/jobs/${job.id}?boardId=${boardId}&mode=view`);
    } catch (err) {
      console.error("Failed to create job:", err);
      toast.error("Failed to create job");
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

      <div className="mb-6">
        <h1 className="text-2xl font-bold">New Job</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Run one or more scheduled actions in the background, like creating a
          submission or sending an email on a recurring basis.
        </p>
      </div>

      <JobForm
        boardId={boardId}
        initialValues={{
          name: "",
          expression: "0 9 * * *",
          actions: [
            createDefaultAction(ACTION_TYPE_SUBMISSION_CREATION, boardId),
          ],
        }}
        submitLabel="Create Job"
        submittingLabel="Creating…"
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/boards/${boardId}`)}
      />
    </div>
  );
};

export default JobCreationPage;
