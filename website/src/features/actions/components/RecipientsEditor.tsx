"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserStore } from "@/store/user.store";
import { RecipientType, type Recipient } from "@/types/button-action";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { useEffect } from "react";

export interface RecipientsEditorProps {
  recipients: Recipient[];
  onChange: (recipients: Recipient[]) => void;
}

export function RecipientsEditor({ recipients, onChange }: RecipientsEditorProps) {
  const { users, init } = useUserStore();

  useEffect(() => {
    init();
  }, [init]);

  function update(index: number, next: Recipient) {
    onChange(recipients.map((r, i) => (i === index ? next : r)));
  }

  function remove(index: number) {
    onChange(recipients.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...recipients, { type: RecipientType.MAIL, value: "" }]);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Recipients</Label>
      {recipients.map((recipient, index) => (
        <div key={index} className="flex items-center gap-1">
          <Select
            value={recipient.type}
            onValueChange={(value) =>
              update(index, {
                type: value as RecipientType,
                value: "",
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={RecipientType.MAIL}>Email</SelectItem>
              <SelectItem value={RecipientType.USER}>User</SelectItem>
            </SelectContent>
          </Select>
          {recipient.type === RecipientType.USER ? (
            <Select
              value={recipient.value}
              onValueChange={(value) => update(index, { ...recipient, value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a user…" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.uuid} value={user.uuid}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={recipient.value}
              onChange={(e) => update(index, { ...recipient, value: e.target.value })}
              placeholder="jane@example.com"
            />
          )}
          <Button
            type="button"
            variant="ghost"
            className="size-8 shrink-0"
            onClick={() => remove(index)}
          >
            <TomatoIcon icon={TomatoIconKey.Trash} className="size-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <TomatoIcon icon={TomatoIconKey.Plus} className="mr-1.5 size-4" />
        Add recipient
      </Button>
    </div>
  );
}
