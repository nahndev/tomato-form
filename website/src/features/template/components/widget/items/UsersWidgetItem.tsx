"use client";

import { Select } from "@/components/ui/select";
import { useUserStore } from "@/store/user.store";
import type { FieldComponentProps } from "@/types/widget";
import { useEffect } from "react";

export function UsersWidgetItem({
  widget,
  value,
  onChange,
}: FieldComponentProps<string>) {
  const { users, isLoading, isError, init } = useUserStore();

  useEffect(() => {
    init();
  }, [init]);

  if (isError) {
    return (
      <p className="mt-2 text-xs text-destructive">Failed to load users.</p>
    );
  }

  if (isLoading && users.length === 0) {
    return <p className="mt-2 text-xs text-muted-foreground">Loading users…</p>;
  }

  return (
    <Select
      id={widget.id}
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={users.length === 0}
    >
      <option value="">
        {users.length === 0 ? "No users available" : "Select a user…"}
      </option>
      {users.map((user) => (
        <option key={user.uuid} value={user.uuid}>
          {user.name}
        </option>
      ))}
    </Select>
  );
}
