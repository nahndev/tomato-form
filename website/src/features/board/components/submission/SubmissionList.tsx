"use client";

import { useBoardContext } from "@/features/board/components/provider/BoardProvider";
import SubmissionItem from "@/features/board/components/submission/SubmissionItem";
import { useDeleteSubmission, useSubmissions } from "@/hooks/useSubmissions";
import { useTemplates } from "@/hooks/useTemplates";
import { FileText, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const SubmissionList: React.FC = () => {
  const board = useBoardContext();
  const { data: templates = [] } = useTemplates();
  const { data: submissions = [], isLoading } = useSubmissions(board.id);
  const { mutateAsync: deleteSubmission } = useDeleteSubmission(board.id);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const templateById = useMemo(
    () => new Map(templates.map((t) => [t.id, t])),
    [templates],
  );

  async function handleDelete(submissionId: string) {
    setDeletingId(submissionId);
    try {
      await deleteSubmission(submissionId);
      toast.success("Submission deleted");
    } catch (err) {
      console.error("Failed to delete submission:", err);
      toast.error("Failed to delete submission");
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-16 text-center">
        <FileText className="mb-4 size-10 text-muted-foreground/40" />
        <h3 className="font-semibold text-muted-foreground">
          No submissions yet
        </h3>
        <p className="mt-1 text-sm text-muted-foreground/70">
          Create a submission from one of this board&apos;s templates
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {submissions.map((submission) => (
        <SubmissionItem key={submission.id} submission={submission} />
      ))}
    </div>
  );
};

export default SubmissionList;
