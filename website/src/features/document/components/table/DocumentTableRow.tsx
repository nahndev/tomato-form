import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatBytes } from "@/lib/format";
import type { ResourceItem } from "@/types/document";
import DocumentTableRowActions from "./DocumentTableRowActions";

interface DocumentTableRowProps {
  document: ResourceItem;
  deletingId: string | null;
  onOpenFolder: (resource: ResourceItem) => void;
  onMove: (resource: ResourceItem) => void;
  onDelete: (id: string) => void;
}

const DocumentTableRow: React.FC<DocumentTableRowProps> = ({
  document,
  deletingId,
  onOpenFolder,
  onMove,
  onDelete,
}) => {
  const isFolder = document.type === "FOLDER";

  return (
    <TableRow>
      <TableCell className="font-medium">
        {isFolder ? (
          <button
            type="button"
            className="flex items-center gap-2 hover:underline"
            onClick={() => onOpenFolder(document)}
          >
            <TomatoIcon icon={TomatoIconKey.Folder} className="size-4 text-muted-foreground" />
            {document.name}
          </button>
        ) : (
          document.name
        )}
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{isFolder ? "Folder" : document.mimeType}</Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {isFolder || document.size === undefined ? "—" : formatBytes(document.size)}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {new Date(document.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right">
        <DocumentTableRowActions
          document={document}
          isFolder={isFolder}
          deletingId={deletingId}
          onMove={onMove}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};

export default DocumentTableRow;
