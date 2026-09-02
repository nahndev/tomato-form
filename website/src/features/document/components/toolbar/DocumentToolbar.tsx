import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DocumentSortMenu from "@/features/document/components/toolbar/DocumentSortMenu";
import type { DocumentSortOption } from "@/features/document/constants/documentSortOptions";

interface DocumentToolbarProps {
  total: number;
  search: string;
  onSearchChange: (value: string) => void;
  sort: DocumentSortOption;
  onSortChange: (value: DocumentSortOption) => void;
  onCreateClick: () => void;
  onCreateFolderClick: () => void;
}

const DocumentToolbar: React.FC<DocumentToolbarProps> = ({
  total,
  search,
  onSearchChange,
  sort,
  onSortChange,
  onCreateClick,
  onCreateFolderClick,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">All documents</span>
        <Badge variant="secondary">{total}</Badge>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <div className="relative w-56">
          <TomatoIcon
            icon={TomatoIconKey.Search}
            className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search name…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>

        <DocumentSortMenu value={sort} onChange={onSortChange} />

        <Button variant="outline" onClick={onCreateFolderClick}>
          <TomatoIcon icon={TomatoIconKey.Folder} />
          New folder
        </Button>

        <Button onClick={onCreateClick}>
          <TomatoIcon icon={TomatoIconKey.Plus} />
          Upload
        </Button>
      </div>
    </div>
  );
};

export default DocumentToolbar;
