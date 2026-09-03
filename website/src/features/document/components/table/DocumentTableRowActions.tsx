import { Button } from "@/components/ui/button";
import type { ResourceItem } from "@/types/document";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";

interface DocumentTableRowActionsProps {
  document: ResourceItem;
  isFolder: boolean;
  deletingId: string | null;
  onMove: (resource: ResourceItem) => void;
  onDelete: (id: string) => void;
}

const DocumentTableRowActions: React.FC<DocumentTableRowActionsProps> = ({
  document,
  isFolder,
  deletingId,
  onMove,
  onDelete,
}) => {
  return (
    <div className="flex justify-end gap-1">
      {!isFolder && document.url && (
        <Button variant="ghost" size="sm" asChild>
          <a
            href={document.url}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            <TomatoIcon icon={TomatoIconKey.Download} />
          </a>
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        aria-label="Move"
        onClick={() => onMove(document)}
      >
        <TomatoIcon icon={TomatoIconKey.Move} />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Delete"
        disabled={deletingId === document.id}
        onClick={() => onDelete(document.id)}
        className="hover:text-destructive"
      >
        {deletingId === document.id ? (
          <TomatoIcon icon={TomatoIconKey.Loader} className="animate-spin" />
        ) : (
          <TomatoIcon icon={TomatoIconKey.Trash} />
        )}
      </Button>
    </div>
  );
};

export default DocumentTableRowActions;
