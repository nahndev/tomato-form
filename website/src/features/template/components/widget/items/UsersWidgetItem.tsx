"use client";

import { useEffect } from "react";
import { Select } from "@/components/ui/select";
import { useUserStore } from "@/store/user.store";
import type { FieldComponentProps } from "@/features/template/components/widget/types";

export function UsersWidgetItem({
  widgetId,
  mode,
  value,
  onChange,
}: FieldComponentProps<string>) {
  const { users, isLoading, isError, init } = useUserStore();

  useEffect(() => {
    init();
  }, [init]);

  if (mode === "preview") {
    return (
      <div className="mt-2 flex h-7 w-full items-center justify-between rounded-md border border-input bg-muted/30 px-2 text-xs text-muted-foreground">
        <span>Select a user…</span>
        <span>▾</span>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="mt-2 text-xs text-destructive">Failed to load users.</p>
    );
  }

  if (isLoading && users.length === 0) {
    return (
      <p className="mt-2 text-xs text-muted-foreground">Loading users…</p>
    );
  }

  return (
    <Select
      id={widgetId}
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
