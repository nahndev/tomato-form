"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      value={value ?? ""}
      onValueChange={(v) => onChange?.(v)}
      disabled={users.length === 0}
    >
      <SelectTrigger id={widget.id}>
        <SelectValue
          placeholder={
            users.length === 0 ? "No users available" : "Select a user…"
          }
        />
      </SelectTrigger>
      <SelectContent>
        {users.map((user) => (
          <SelectItem key={user.uuid} value={user.uuid}>
            {user.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
