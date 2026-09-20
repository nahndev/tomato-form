"use client";

import { Input } from "@/components/ui/input";
import type { ActionSetupProps } from "@/features/actions/registry";
import type { LinkAction } from "@/types/button-action";

export function OpenLinkActionSetup({
  action,
  onChange,
}: ActionSetupProps<LinkAction>) {
  return (
    <Input
      value={action.url}
      onChange={(e) => onChange({ ...action, url: e.target.value })}
      placeholder="https://…"
    />
  );
}
