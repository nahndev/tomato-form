import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DocumentPaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

const DocumentPagination: React.FC<DocumentPaginationProps> = ({
  page,
  pageCount,
  onPageChange,
}) => {
  if (pageCount <= 1) return null;

  function goTo(e: React.MouseEvent, target: number) {
    e.preventDefault();
    onPageChange(Math.min(Math.max(target, 1), pageCount));
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => goTo(e, page - 1)}
            className={page === 1 ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>

        {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
          <PaginationItem key={p}>
            <PaginationLink href="#" isActive={p === page} onClick={(e) => goTo(e, p)}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => goTo(e, page + 1)}
            className={page === pageCount ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default DocumentPagination;
