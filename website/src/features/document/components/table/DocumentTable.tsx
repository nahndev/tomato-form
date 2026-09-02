import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBytes } from "@/lib/format";
import type { Document } from "@/types/document";

interface DocumentTableProps {
  documents: Document[];
  hasAnyDocuments: boolean;
  isLoading: boolean;
  isError: boolean;
  deletingId: string | null;
  onRetry: () => void;
  onDelete: (id: string) => void;
}

const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  hasAnyDocuments,
  isLoading,
  isError,
  deletingId,
  onRetry,
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
          {hasAnyDocuments ? "No documents match your search" : "No documents yet"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground/70">
          {hasAnyDocuments ? "Try a different search term or filter" : "Upload a file to get started"}
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
            <TableRow key={document.id}>
              <TableCell className="font-medium">{document.originalName}</TableCell>
              <TableCell>
                <Badge variant="secondary">{document.mimeType}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{formatBytes(document.size)}</TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(document.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={document.url} target="_blank" rel="noopener noreferrer" download>
                      Download
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete document"
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentTable;
