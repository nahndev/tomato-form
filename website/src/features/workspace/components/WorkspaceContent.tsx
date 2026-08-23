"use client";

import { useMemo, useState } from "react";
import { BoardProvider } from "@/features/board";
import { useSubmissions } from "@/features/board/hooks/useSubmissions";
import WorkspaceBoardContent from "@/features/workspace/components/WorkspaceBoardContent";
import WorkspaceBoardHeader from "@/features/workspace/components/WorkspaceBoardHeader";
import type { Board } from "@/types/board";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";

const PAGE_SIZE = 8;

export interface WorkspaceContentProps {
  board: Board | null;
}

const WorkspaceContent: React.FC<WorkspaceContentProps> = ({ board }) => {
  const [templateFilter, setTemplateFilter] = useState("all");
  const [page, setPage] = useState(1);

  const {
    data: submissions = [],
    isLoading,
    isError,
    refetch,
  } = useSubmissions(board?.id);

  const templateIdByVersionId = useMemo(() => {
    const map = new Map<string, string>();
    board?.templates.forEach((template) =>
      template.templateVersions?.forEach((version) =>
        map.set(version.id, template.id),
      ),
    );
    return map;
  }, [board]);

  const filtered = useMemo(() => {
    if (templateFilter === "all") return submissions;
    return submissions.filter(
      (submission) =>
        templateIdByVersionId.get(submission.templateVersionId) ===
        templateFilter,
    );
  }, [submissions, templateFilter, templateIdByVersionId]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function handleTemplateFilterChange(templateId: string) {
    setTemplateFilter(templateId);
    setPage(1);
  }

  if (!board) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <TomatoIcon
          icon={TomatoIconKey.LayoutGrid}
          className="mb-4 size-10 text-muted-foreground/40"
        />
        <h3 className="font-semibold text-muted-foreground">
          No board selected
        </h3>
        <p className="mt-1 text-sm text-muted-foreground/70">
          Create a board first to view its submissions
        </p>
      </div>
    );
  }

  return (
    <BoardProvider board={board}>
      <div className="flex h-full flex-col overflow-hidden">
        <WorkspaceBoardHeader
          board={board}
          templateFilter={templateFilter}
          onTemplateFilterChange={handleTemplateFilterChange}
          page={currentPage}
          pageCount={pageCount}
          onPageChange={setPage}
        />
        <div className="flex-1 overflow-auto px-4 py-4">
          <WorkspaceBoardContent
            submissions={paginated}
            hasAnySubmissions={submissions.length > 0}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
          />
        </div>
      </div>
    </BoardProvider>
  );
};

export default WorkspaceContent;
