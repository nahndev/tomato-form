"use client";

import { useMemo, useState } from "react";
import { toast } from "@/components/ui/sonner";
import CreateDocumentDialog from "@/features/document/components/CreateDocumentDialog";
import CreateFolderDialog from "@/features/document/components/CreateFolderDialog";
import DocumentManagerHeader from "@/features/document/components/header/DocumentManagerHeader";
import MoveResourceDialog from "@/features/document/components/MoveResourceDialog";
import DocumentTable from "@/features/document/components/table/DocumentTable";
import DocumentToolbar from "@/features/document/components/toolbar/DocumentToolbar";
import type { DocumentSortOption } from "@/features/document/constants/documentSortOptions";
import { useDeleteDocument, useResources } from "@/features/document/hooks/useDocuments";
import type { ResourceItem } from "@/types/document";

interface Crumb {
  id: string | null;
  name: string;
}

const ROOT_CRUMB: Crumb = { id: null, name: "Documents" };

function sortDocuments(documents: ResourceItem[], sort: DocumentSortOption) {
  const sorted = [...documents];
  switch (sort) {
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "newest":
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case "oldest":
      return sorted.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  }
}

const DocumentManagement: React.FC = () => {
  const [breadcrumbs, setBreadcrumbs] = useState<Crumb[]>([ROOT_CRUMB]);
  const currentParentId = breadcrumbs[breadcrumbs.length - 1].id;

  const { data: documents = [], isLoading, isError, refetch } = useResources(currentParentId);
  const { mutateAsync: deleteDocument } = useDeleteDocument(currentParentId);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<DocumentSortOption>("name-asc");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [movingResource, setMovingResource] = useState<ResourceItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matches = query ? documents.filter((d) => d.name.toLowerCase().includes(query)) : documents;
    return sortDocuments(matches, sort);
  }, [documents, search, sort]);

  function handleSearchChange(value: string) {
    setSearch(value);
  }

  function handleSortChange(value: DocumentSortOption) {
    setSort(value);
  }

  function openFolder(resource: ResourceItem) {
    setBreadcrumbs((prev) => [...prev, { id: resource.id, name: resource.name }]);
    setSearch("");
  }

  function goToCrumb(index: number) {
    setBreadcrumbs((prev) => prev.slice(0, index + 1));
    setSearch("");
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteDocument(id);
      toast.success("Deleted");
    } catch (err) {
      console.error("Failed to delete resource:", err);
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="container mx-auto max-w-5xl px-6 py-10">
      <DocumentManagerHeader />

      <div className="mt-4 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.id ?? "root"} className="flex items-center gap-1">
            {index > 0 && <span>/</span>}
            <button
              type="button"
              className="hover:text-foreground hover:underline disabled:pointer-events-none disabled:font-medium disabled:text-foreground"
              disabled={index === breadcrumbs.length - 1}
              onClick={() => goToCrumb(index)}
            >
              {crumb.name}
            </button>
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <DocumentToolbar
          total={filtered.length}
          search={search}
          onSearchChange={handleSearchChange}
          sort={sort}
          onSortChange={handleSortChange}
          onCreateClick={() => setUploadDialogOpen(true)}
          onCreateFolderClick={() => setFolderDialogOpen(true)}
        />

        <DocumentTable
          documents={filtered}
          hasAnyDocuments={documents.length > 0}
          isLoading={isLoading}
          isError={isError}
          deletingId={deletingId}
          onRetry={refetch}
          onOpenFolder={openFolder}
          onMove={setMovingResource}
          onDelete={handleDelete}
        />
      </div>

      <CreateDocumentDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} parentId={currentParentId} />
      <CreateFolderDialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen} parentId={currentParentId} />
      <MoveResourceDialog
        open={movingResource !== null}
        onOpenChange={(open) => !open && setMovingResource(null)}
        resource={movingResource}
        currentParentId={currentParentId}
      />
    </div>
  );
};

export default DocumentManagement;
