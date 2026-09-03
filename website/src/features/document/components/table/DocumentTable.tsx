import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ResourceItem } from "@/types/document";
import DocumentTableRow from "./DocumentTableRow";

interface DocumentTableProps {
  documents: ResourceItem[];
  hasAnyDocuments: boolean;
  isLoading: boolean;
  isError: boolean;
  deletingId: string | null;
  onRetry: () => void;
  onOpenFolder: (resource: ResourceItem) => void;
  onMove: (resource: ResourceItem) => void;
  onDelete: (id: string) => void;
}

const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  hasAnyDocuments,
  isLoading,
  isError,
  deletingId,
  onRetry,
  onOpenFolder,
  onMove,
  onDelete,
}) => {
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 py-16 text-center">
        <p className="font-semibold text-destructive">Failed to load documents</p>
        <p className="mt-1 text-sm text-muted-foreground">Please try again.</p>
        <Button size="sm" variant="outline" className="mt-4" onClick={onRetry}>
          Try Again
        </Button>
      </div>
    );
  }

  if (isLoading && !hasAnyDocuments) {
    return (
      <div className="flex items-center justify-center py-20">
        <TomatoIcon icon={TomatoIconKey.Loader} className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-20 text-center">
        <TomatoIcon icon={TomatoIconKey.Database} className="mb-4 size-12 text-muted-foreground/40" />
        <h3 className="font-semibold text-muted-foreground">
          {hasAnyDocuments ? "No documents match your search" : "This folder is empty"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground/70">
          {hasAnyDocuments ? "Try a different search term or filter" : "Upload a file or create a folder to get started"}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <DocumentTableRow
              key={document.id}
              document={document}
              deletingId={deletingId}
              onOpenFolder={onOpenFolder}
              onMove={onMove}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentTable;
