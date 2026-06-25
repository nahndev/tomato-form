import { Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserSortMenu, { type UserSortOption } from "@/features/user/components/toolbar/UserSortMenu";

interface UserToolbarProps {
  total: number;
  search: string;
  onSearchChange: (value: string) => void;
  sort: UserSortOption;
  onSortChange: (value: UserSortOption) => void;
  onCreateClick: () => void;
}

const UserToolbar: React.FC<UserToolbarProps> = ({
  total,
  search,
  onSearchChange,
  sort,
  onSortChange,
  onCreateClick,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">All users</span>
        <Badge variant="secondary">{total}</Badge>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <div className="relative w-56">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>

        <UserSortMenu value={sort} onChange={onSortChange} />

        <Button onClick={onCreateClick}>
          <Plus />
          Create
        </Button>
      </div>
    </div>
  );
};

export default UserToolbar;
