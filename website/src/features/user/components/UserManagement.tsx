"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import CreateUserDialog from "@/features/user/components/CreateUserDialog";
import UserManagerHeader from "@/features/user/components/header/UserManagerHeader";
import UserPagination from "@/features/user/components/table/UserPagination";
import UserTable from "@/features/user/components/table/UserTable";
import UserToolbar from "@/features/user/components/toolbar/UserToolbar";
import type { UserSortOption } from "@/features/user/components/toolbar/UserSortMenu";
import { useUserStore } from "@/store/user.store";
import type { User } from "@/types/user";

const PAGE_SIZE = 8;

function sortUsers(users: User[], sort: UserSortOption) {
  const sorted = [...users];
  switch (sort) {
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime(),
      );
    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.createdAt ?? 0).getTime() -
          new Date(b.createdAt ?? 0).getTime(),
      );
  }
}

const UserManagement: React.FC = () => {
  const users = useUserStore((s) => s.users);
  const isLoading = useUserStore((s) => s.isLoading);
  const isError = useUserStore((s) => s.isError);
  const init = useUserStore((s) => s.init);
  const refetch = useUserStore((s) => s.refetch);
  const deleteUser = useUserStore((s) => s.deleteUser);

  useEffect(() => {
    init();
  }, [init]);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<UserSortOption>("name-asc");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deletingUuid, setDeletingUuid] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matches = query
      ? users.filter((u) => u.name.toLowerCase().includes(query))
      : users;
    return sortUsers(matches, sort);
  }, [users, search, sort]);

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

  function handleSortChange(value: UserSortOption) {
    setSort(value);
    setPage(1);
  }

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(user: User) {
    setEditing(user);
    setDialogOpen(true);
  }

  async function handleDelete(uuid: string) {
    setDeletingUuid(uuid);
    try {
      await deleteUser(uuid);
      toast.success("User deleted");
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error("Failed to delete user");
    } finally {
      setDeletingUuid(null);
    }
  }

  return (
    <div className="container mx-auto max-w-5xl px-6 py-10">
      <UserManagerHeader />

      <div className="mt-8 flex flex-col gap-4">
        <UserToolbar
          total={filtered.length}
          search={search}
          onSearchChange={handleSearchChange}
          sort={sort}
          onSortChange={handleSortChange}
          onCreateClick={openCreate}
        />

        <UserTable
          users={paginated}
          hasAnyUsers={users.length > 0}
          isLoading={isLoading}
          isError={isError}
          deletingUuid={deletingUuid}
          onRetry={refetch}
          onEdit={openEdit}
          onDelete={handleDelete}
        />

        <UserPagination
          page={currentPage}
          pageCount={pageCount}
          onPageChange={setPage}
        />
      </div>

      <CreateUserDialog
        open={dialogOpen}
        editing={editing}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default UserManagement;
