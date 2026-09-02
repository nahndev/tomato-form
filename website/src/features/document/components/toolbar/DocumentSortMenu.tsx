import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DOCUMENT_SORT_OPTIONS,
  type DocumentSortOption,
} from "@/features/document/constants/documentSortOptions";

interface DocumentSortMenuProps {
  value: DocumentSortOption;
  onChange: (value: DocumentSortOption) => void;
}

const DocumentSortMenu: React.FC<DocumentSortMenuProps> = ({ value, onChange }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <TomatoIcon icon={TomatoIconKey.ListFilter} />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(v) => onChange(v as DocumentSortOption)}
        >
          {DOCUMENT_SORT_OPTIONS.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DocumentSortMenu;
