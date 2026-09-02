"use client";

import { useMemo, useState } from "react";
import { toast } from "@/components/ui/sonner";
import CreateDocumentDialog from "@/features/document/components/CreateDocumentDialog";
import DocumentManagerHeader from "@/features/document/components/header/DocumentManagerHeader";
import DocumentPagination from "@/features/document/components/table/DocumentPagination";
import DocumentTable from "@/features/document/components/table/DocumentTable";
import DocumentToolbar from "@/features/document/components/toolbar/DocumentToolbar";
import type { DocumentSortOption } from "@/features/document/constants/documentSortOptions";
import { useDeleteDocument, useDocuments } from "@/features/document/hooks/useDocuments";
import type { Document } from "@/types/document";

const PAGE_SIZE = 8;

function sortDocuments(documents: Document[], sort: DocumentSortOption) {
  const sorted = [...documents];
  switch (sort) {
    case "name-asc":
      return sorted.sort((a, b) => a.originalName.localeCompare(b.originalName));
    case "name-desc":
      return sorted.sort((a, b) => b.originalName.localeCompare(a.originalName));
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
  const { data: documents = [], isLoading, isError, refetch } = useDocuments();
  const { mutateAsync: deleteDocument } = useDeleteDocument();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<DocumentSortOption>("name-asc");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matches = query
      ? documents.filter((s) => s.originalName.toLowerCase().includes(query))
      : documents;
    return sortDocuments(matches, sort);
  }, [documents, search, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleSortChange(value: DocumentSortOption) {
    setSort(value);
    setPage(1);
  }

  function openCreate() {
    setDialogOpen(true);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteDocument(id);
      toast.success("Document deleted");
    } catch (err) {
      console.error("Failed to delete document:", err);
      toast.error("Failed to delete document");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="container mx-auto max-w-5xl px-6 py-10">
      <DocumentManagerHeader />

      <div className="mt-8 flex flex-col gap-4">
        <DocumentToolbar
          total={filtered.length}
          search={search}
          onSearchChange={handleSearchChange}
          sort={sort}
          onSortChange={handleSortChange}
          onCreateClick={openCreate}
        />

        <DocumentTable
          documents={paginated}
          hasAnyDocuments={documents.length > 0}
          isLoading={isLoading}
          isError={isError}
          deletingId={deletingId}
          onRetry={refetch}
          onDelete={handleDelete}
        />

        <DocumentPagination page={currentPage} pageCount={pageCount} onPageChange={setPage} />
      </div>

      <CreateDocumentDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

export default DocumentManagement;
