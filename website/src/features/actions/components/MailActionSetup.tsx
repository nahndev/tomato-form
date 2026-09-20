"use client";

import { Input } from "@/components/ui/input";
import { RecipientsEditor } from "@/features/actions/components/RecipientsEditor";
import type { ActionSetupProps } from "@/features/actions/registry";
import type { MailAction } from "@/types/button-action";

export function MailActionSetup({
  action,
  onChange,
}: ActionSetupProps<MailAction>) {
  return (
    <div className="flex flex-col gap-2">
      <RecipientsEditor
        recipients={action.recipients}
        onChange={(recipients) => onChange({ ...action, recipients })}
      />
      <Input
        value={action.subject}
        onChange={(e) => onChange({ ...action, subject: e.target.value })}
        placeholder="Subject"
      />
      <textarea
        value={action.body}
        onChange={(e) => onChange({ ...action, body: e.target.value })}
        rows={3}
        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        placeholder="Mail content…"
      />
    </div>
  );
}
