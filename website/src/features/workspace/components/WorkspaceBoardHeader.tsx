"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MoreSubmissionButton from "@/features/board/components/header/MoreSubmissionButton";
import type { Board } from "@/types/board";

export interface WorkspaceBoardHeaderProps {
  board: Board;
  templateFilter: string;
  onTemplateFilterChange: (templateId: string) => void;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

const WorkspaceBoardHeader: React.FC<WorkspaceBoardHeaderProps> = ({
  board,
  templateFilter,
  onTemplateFilterChange,
  page,
  pageCount,
  onPageChange,
}) => {
  function goTo(e: React.MouseEvent, target: number) {
    e.preventDefault();
    onPageChange(Math.min(Math.max(target, 1), pageCount));
  }

  return (
    <div className="flex items-center gap-3 border-b px-4 py-3">
      <h2 className="shrink-0 text-lg font-semibold">{board.name}</h2>

      <Select value={templateFilter} onValueChange={onTemplateFilterChange}>
        <SelectTrigger aria-label="Filter by template" className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All templates</SelectItem>
          {board.templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex-1" />

      {pageCount > 1 && (
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => goTo(e, page - 1)}
                className={
                  page === 1 ? "pointer-events-none opacity-50" : undefined
                }
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-2 text-sm text-muted-foreground">
                Page {page} of {pageCount}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => goTo(e, page + 1)}
                className={
                  page === pageCount
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <MoreSubmissionButton />
    </div>
  );
};

export default WorkspaceBoardHeader;
