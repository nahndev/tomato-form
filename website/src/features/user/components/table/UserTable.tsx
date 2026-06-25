import { Loader2, Pencil, Trash2, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User } from "@/types/user";

interface UserTableProps {
  users: User[];
  hasAnyUsers: boolean;
  isLoading: boolean;
  isError: boolean;
  deletingUuid: string | null;
  onRetry: () => void;
  onEdit: (user: User) => void;
  onDelete: (uuid: string) => void;
}

function initials(name: string) {
  return name.trim().slice(0, 2).toUpperCase();
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  hasAnyUsers,
  isLoading,
  isError,
  deletingUuid,
  onRetry,
  onEdit,
  onDelete,
}) => {
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 py-16 text-center">
        <p className="font-semibold text-destructive">Failed to load users</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Please try again.
        </p>
        <Button size="sm" variant="outline" className="mt-4" onClick={onRetry}>
          Try Again
        </Button>
      </div>
    );
  }

  if (isLoading && !hasAnyUsers) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-20 text-center">
        <UserRound className="mb-4 size-12 text-muted-foreground/40" />
        <h3 className="font-semibold text-muted-foreground">
          {hasAnyUsers ? "No users match your search" : "No users yet"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground/70">
          {hasAnyUsers
            ? "Try a different search term or filter"
            : "Create your first user to get started"}
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
            <TableHead>Email</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.uuid}>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar size="sm">
                    <AvatarFallback>{initials(u.name)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{u.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {u.email || "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Edit user"
                    onClick={() => onEdit(u)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete user"
                    disabled={deletingUuid === u.uuid}
                    onClick={() => onDelete(u.uuid)}
                    className="hover:text-destructive"
                  >
                    {deletingUuid === u.uuid ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Trash2 />
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

export default UserTable;
