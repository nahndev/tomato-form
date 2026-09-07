import { Row } from "@/components/layouts";
import { toast } from "@/components/ui/sonner";
import { useBoardContext } from "@/features/board/components/provider/BoardProvider";
import BoardColumnCell from "@/features/board/components/submission/BoardColumnCell";
import { useDeleteSubmission } from "@/features/board/hooks/useSubmissions";
import { JsonSubmission } from "@/features/board/utils/submission";
import { Submission } from "@/types/submission";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import Link from "next/link";

export type SubmissionItemProps = {
  submission: Submission;
};

const SubmissionItem: React.FC<SubmissionItemProps> = ({ submission }) => {
  const board = useBoardContext();

  const { mutateAsync: deleteSubmission, isPending } = useDeleteSubmission(
    board.id,
  );

  return (
    <Link
      key={submission.id}
      href={`/submission/${submission.id}`}
      rel="noopener noreferrer"
    >
      <Row className="group hover:bg-accent">
        <div className="flex flex-1 items-center gap-2">
          {board.columns.map((column) => {
            const value = JsonSubmission.getDisplayValue(submission, column);
            return (
              <BoardColumnCell
                key={column.id}
                column={column}
                displayValue={value}
              />
            );
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
      </Row>
    </Link>
  );
};

export default SubmissionItem;
