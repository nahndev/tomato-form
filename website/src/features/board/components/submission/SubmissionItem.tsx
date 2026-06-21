import { useBoardContext } from "@/features/board/components/provider/BoardProvider";
import { useDeleteSubmission } from "@/hooks/useSubmissions";
import { useTemplates } from "@/hooks/useTemplates";
import { Submission } from "@/types/submission";
import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";

export type SubmissionItemProps = {
  submission: Submission;
};

const SubmissionItem: React.FC<SubmissionItemProps> = ({ submission }) => {
  const board = useBoardContext();

  const { data: templates = [] } = useTemplates();
  const template = templates.find((t) => t.id === submission.templateId)!;
  const { mutateAsync: deleteSubmission, isPending } = useDeleteSubmission(
    board.id,
  );
  return (
    <Link
      key={submission.id}
      href={`/boards/${board.id}/submissions/${submission.id}`}
    >
      <div className="flex flex-row items-center p-2 group hover:bg-accent">
        <div className="flex items-start justify-between gap-2">
          <div className="text-base">{template.name}</div>
        </div>
        <div>
          {submission.createdAt
            ? new Date(submission.createdAt).toLocaleString()
            : "—"}
        </div>
        <div className="ml-2 flex-1" />
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteSubmission(submission.id);
            }}
            className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 disabled:opacity-50"
            aria-label="Delete submission"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default SubmissionItem;
