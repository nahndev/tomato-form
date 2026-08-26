"use client";

import {
  ListTable,
  type ListTableColumn,
} from "@/components/list-table/ListTable";
import { useMultiSelect } from "@/components/list-table/useMultiSelect";
import { toast } from "@/components/ui/sonner";
import { useDeleteTemplate } from "@/features/template";
import DashboardRowMenu from "@/features/template/components/dashboard/DashboardRowMenu";
import DashboardToolbar from "@/features/template/components/dashboard/DashboardToolbar";
import { getDateBucket } from "@/features/template/utils/getDateBucket";
import type { Template } from "@/types/template";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DashboardContentProps {
  templates: Template[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

const columns: ListTableColumn<Template>[] = [
  {
    id: "name",
    header: "Name",
    cell: (t) => (
      <div className="flex items-center gap-2">
        <TomatoIcon
          icon={TomatoIconKey.Document}
          className="size-4 text-primary"
        />
        <span className="font-medium">{t.name}</span>
      </div>
    ),
  },
  {
    id: "who-and-where",
    header: "Who & where",
    cell: () => <span className="text-muted-foreground">—</span>,
  },
];

const DashboardContent: React.FC<DashboardContentProps> = ({
  templates,
  isLoading,
  isError,
  onRetry,
}) => {
  const router = useRouter();
  const { mutateAsync: deleteTemplate } = useDeleteTemplate();
  const { selectedIds, setSelectedIds, clear } = useMultiSelect(
    templates,
    (t) => t.id,
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  async function handleDeleteOne(id: string) {
    setDeletingId(id);
    try {
      await deleteTemplate(id);
      toast.success("Template deleted");
    } catch (err) {
      console.error("Failed to delete template:", err);
      toast.error("Failed to delete template");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleBulkDelete(ids: Set<string>) {
    setBulkDeleting(true);
    try {
      await Promise.all([...ids].map((id) => deleteTemplate(id)));
      toast.success("Templates deleted");
      clear();
    } catch (err) {
      console.error("Failed to delete templates:", err);
      toast.error("Failed to delete templates");
    } finally {
      setBulkDeleting(false);
    }
  }

  return (
    <ListTable
      items={templates}
      getId={(t) => t.id}
      columns={columns}
      groupBy={(t) => getDateBucket(t.createdAt)}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
      onRowDoubleClick={(t) => router.push(`/templates/${t.id}`)}
      renderRowMenu={(t) => (
        <DashboardRowMenu
          templateId={t.id}
          isDeleting={deletingId === t.id}
          onDelete={() => handleDeleteOne(t.id)}
        />
      )}
      renderToolbar={({ selectedIds, clear }) => (
        <DashboardToolbar
          selectedCount={selectedIds.size}
          isDeleting={bulkDeleting}
          onClear={clear}
          onDelete={() => handleBulkDelete(selectedIds)}
        />
      )}
      emptyState={
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-20 text-center">
          <TomatoIcon
            icon={TomatoIconKey.Document}
            className="mb-4 size-12 text-muted-foreground/40"
          />
          <h3 className="font-semibold text-muted-foreground">
            No templates yet
          </h3>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Create your first template to get started
          </p>
        </div>
      }
    />
  );
};

export default DashboardContent;
