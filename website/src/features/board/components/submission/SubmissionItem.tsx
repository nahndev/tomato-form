import { FlexRow } from "@/components/ui/flex-row";
import { toast } from "@/components/ui/sonner";
import { useBoardContext } from "@/features/board/components/provider/BoardProvider";
import BoardColumnCell from "@/features/board/components/submission/BoardColumnCell";
import { useDeleteSubmission } from "@/features/board/hooks/useSubmissions";
import { useTemplates } from "@/features/template";
import { Submission } from "@/types/submission";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import Link from "next/link";

export type SubmissionItemProps = {
  submission: Submission;
};

const SubmissionItem: React.FC<SubmissionItemProps> = ({ submission }) => {
  const board = useBoardContext();

  const { data: templates = [] } = useTemplates();
  const template = templates.find((t) =>
    t.templateVersions?.some((v) => v.id === submission.templateVersionId),
  );
  const { mutateAsync: deleteSubmission, isPending } = useDeleteSubmission(
    board.id,
  );
  return (
    <Link
      key={submission.id}
      href={`/submission/${submission.id}`}
      rel="noopener noreferrer"
    >
      <FlexRow className="group hover:bg-accent">
        <div className="flex flex-1 items-center gap-2">
          {board.columns.map((column) => {
            return <BoardColumnCell key={column.id} type={column.type} />;
          })}
        </div>
        <div className="w-40 flex flex-row-reverse">
          <button
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              try {
                await deleteSubmission(submission.id);
                toast.success("Submission deleted");
              } catch (err) {
                console.error("Failed to delete submission:", err);
                toast.error("Failed to delete submission");
              }
            }}
            disabled={isPending}
            className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 disabled:opacity-50"
            aria-label="Delete submission"
          >
            {isPending ? (
              <TomatoIcon
                icon={TomatoIconKey.Loader}
                className="size-4 animate-spin"
              />
            ) : (
              <TomatoIcon icon={TomatoIconKey.Trash} className="size-4" />
            )}
          </button>
        </div>
      </FlexRow>
    </Link>
  );
};

export default SubmissionItem;
